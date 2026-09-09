<?php

namespace App\Models\Concerns;

trait HasPhoneNumberParts
{
    protected function phonePartsSourceAttributes(): array
    {
        return ['mobile_number', 'business_mobile', 'contact_info', 'phone'];
    }

    protected function phonePartsEmptyValue()
    {
        return 'N/A';
    }

    protected function getPhonePartsSource(): string
    {
        foreach ($this->phonePartsSourceAttributes() as $attribute) {
            if (array_key_exists($attribute, $this->attributes) && $this->attributes[$attribute] !== null) {
                return (string) $this->attributes[$attribute];
            }
        }

        return '';
    }

    public function splitPhoneParts(?string $phone = null): array
    {
        $digits = preg_replace('/\D+/', '', (string) ($phone ?? $this->getPhonePartsSource()));
        $emptyValue = $this->phonePartsEmptyValue();

        if ($digits === '') {
            return ['extension' => $emptyValue, 'mobile' => $emptyValue];
        }

        if (strlen($digits) > 10) {
            $extension = substr($digits, 0, -10);

            return [
                'extension' => $extension ? '+' . $extension : $emptyValue,
                'mobile' => substr($digits, -10),
            ];
        }

        return [
            'extension' => $emptyValue,
            'mobile' => $digits,
        ];
    }

    public function getPhoneExtensionAttribute()
    {
        return $this->splitPhoneParts()['extension'];
    }

    public function getMobileWithoutExtensionAttribute()
    {
        return $this->splitPhoneParts()['mobile'];
    }
}
