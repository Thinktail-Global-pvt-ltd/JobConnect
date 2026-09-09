<?php

namespace App\Models\Concerns;

trait HasPhoneNumberParts
{
    protected function getPhonePartsSource(): string
    {
        foreach (['mobile_number', 'business_mobile', 'contact_info', 'phone'] as $attribute) {
            if (array_key_exists($attribute, $this->attributes) && $this->attributes[$attribute] !== null) {
                return (string) $this->attributes[$attribute];
            }
        }

        return '';
    }

    protected function splitPhoneParts(?string $phone): array
    {
        $emptyValue = property_exists($this, 'phonePartsEmptyValue') ? $this->phonePartsEmptyValue : 'N/A';
        $digits = preg_replace('/\D+/', '', (string) $phone);

        if ($digits === '') {
            return ['extension' => $emptyValue, 'mobile' => $emptyValue];
        }

        if (strlen($digits) > 10) {
            $extension = substr($digits, 0, -10);

            return [
                'extension' => $extension ? '+' . $extension : 'N/A',
                'mobile' => substr($digits, -10),
            ];
        }

        return [
            'extension' => $emptyValue,
            'mobile' => $digits,
        ];
    }

    public function getPhoneExtensionAttribute(): string
    {
        return $this->splitPhoneParts($this->getPhonePartsSource())['extension'];
    }

    public function getMobileWithoutExtensionAttribute(): string
    {
        return $this->splitPhoneParts($this->getPhonePartsSource())['mobile'];
    }
}
