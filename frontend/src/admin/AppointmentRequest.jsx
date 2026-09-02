import React, { useState } from 'react';
import { 
  Clock, MapPin, ShieldCheck, Phone, MessageSquare, Send, Calendar, 
  ChevronRight, CircleAlert, Plus, Minus, CheckCircle2, Copy, Check, House, House as HomeIcon
} from 'lucide-react';

export default function AppointmentRequest() {
  const TARGET_PHONE = '8799730966';

  const [petSpecies, setPetSpecies] = useState('Dog');
  const [petName, setPetName] = useState('');
  const [reason, setReason] = useState('General Consultation / Illness');
  const [prefDate, setPrefDate] = useState('');
  const [prefTime, setPrefTime] = useState('Morning (6:00 AM – 10:00 AM)');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "What are Blue Coat Vet's opening hours?",
      a: "The clinic is open every day from 6:00 AM to 11:30 PM. We recommend calling or booking an appointment in advance so Dr. Shashank and the medical team can prepare for your pet."
    },
    {
      q: "How do I book an appointment?",
      a: "You can book directly using the online request form above, or call/WhatsApp our reception at +91 8799730966. We confirm your exact slot directly via call or message."
    },
    {
      q: "Does Blue Coat Vet treat both dogs and cats?",
      a: "Yes! We specialize in companion animal veterinary medicine for both dogs and cats, offering separate low-stress handling protocols for felines."
    },
    {
      q: "What vaccination packages are available?",
      a: "We offer comprehensive Dog Annual Vaccination Bundles (₹2,599) including core DHPPiL booster & Anti-Rabies, as well as Feline Annual Packages (₹1,499) and Tom Cat Neutering (₹9,100)."
    },
    {
      q: "Does the clinic provide X-ray and laboratory testing on-site?",
      a: "Yes, Blue Coat Vet features an in-house diagnostic laboratory (CBC, Biochemistry, Tick Panels) and high-resolution Digital X-Ray for rapid same-day diagnostics."
    },
    {
      q: "Does the clinic offer pet admission and surgery?",
      a: "Yes, we have a sterile operation theatre for orthopedic & soft tissue surgeries, as well as a temperature-controlled recovery ward for post-op day admissions."
    },
    {
      q: "What should I bring to my pet’s first visit?",
      a: "Please bring any previous vaccination cards, medical records, or current medications. Having your pet safely leashed or in a cat carrier is highly recommended."
    },
    {
      q: "Which areas in Gurgaon do you serve?",
      a: "We primarily serve Sushant Lok Phase I, II, III, Sector 43, Sector 57, Golf Course Road, and surrounding areas across Gurgaon."
    }
  ];

  const generateMessageText = () => {
    return `📋 *VET APPOINTMENT REQUEST - BLUE COAT VET*
----------------------------------------
🐾 *Pet Species:* ${petSpecies}
🐶 *Pet's Name:* ${petName.trim() || 'Not Provided'}
🩺 *Reason for Visit:* ${reason}
📅 *Preferred Date:* ${prefDate || 'As soon as possible'}
⏰ *Preferred Time:* ${prefTime}

👤 *Owner / Parent Name:* ${ownerName.trim() || 'Not Provided'}
📞 *Phone / WhatsApp:* ${phone.trim() || 'Not Provided'}
📝 *Notes / Symptoms:* ${notes.trim() || 'None'}
----------------------------------------
Sent via Online Appointment Widget`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!petName.trim()) {
      setErrorMsg("Please enter your pet's name.");
      return;
    }
    if (!ownerName.trim()) {
      setErrorMsg("Please enter owner / pet parent name.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter phone / WhatsApp number.");
      return;
    }
    if (!consent) {
      setErrorMsg("Please check the consent agreement to proceed.");
      return;
    }

    setErrorMsg('');
    setSubmitted(true);

    const cleanPhone = '91' + TARGET_PHONE.replace(/[^0-9]/g, '');
    const message = generateMessageText();
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateMessageText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="appointment-page" className="py-8 bg-[#FBF7F0] font-sans text-slate-800 text-left -m-5 sm:-m-6 md:-m-8 min-h-screen">
      
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs md:text-sm text-[#4A5568] py-2 flex-wrap">
          <a href="/" className="inline-flex items-center gap-1 hover:text-[#6B46C1] transition-colors">
            <HomeIcon className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </a>
          <ChevronRight className="w-3 h-3 text-[#B9873F] shrink-0" />
          <span className="hover:text-[#6B46C1] transition-colors cursor-pointer">Blue Coat Vet</span>
          <ChevronRight className="w-3 h-3 text-[#B9873F] shrink-0" />
          <span className="font-semibold text-[#44337A] truncate">Book an Appointment</span>
        </nav>
      </div>

      {/* Main Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-3xl mb-8 md:mb-11 text-center mx-auto">
          <span className="inline-block text-[11px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3 text-[#6B46C1]">
            Consultation Booking
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-serif leading-tight font-medium text-[#44337A]">
            Book a Vet Appointment in Gurgaon with Dr. Shashank
          </h1>
          <p className="mt-3 text-base md:text-lg leading-relaxed text-[#4A5568] mx-auto max-w-[60ch]">
            Doctor-led veterinary care for dogs and cats. Open daily from 6:00 AM to 11:30 PM at C-1532 Vyapar Kendra Road, Sushant Lok.
          </p>
        </div>

        {/* 3 Badge Pill Cards */}
        <div className="max-w-2xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E7E0D2] shadow-2xs flex items-center justify-center gap-2 text-xs font-semibold text-[#2E1A5C]">
            <Clock className="w-4 h-4 text-[#B9873F] shrink-0" />
            <span>Daily: 6:00 AM – 11:30 PM</span>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-[#E7E0D2] shadow-2xs flex items-center justify-center gap-2 text-xs font-semibold text-[#2E1A5C]">
            <MapPin className="w-4 h-4 text-[#3B1B76] shrink-0" />
            <span>Sushant Lok, Gurgaon</span>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-[#E7E0D2] shadow-2xs flex items-center justify-center gap-2 text-xs font-semibold text-[#2E1A5C]">
            <ShieldCheck className="w-4 h-4 text-[#6E8B67] shrink-0" />
            <span>Doctor-Led Consultations</span>
          </div>
        </div>

        {/* Urgent Callout Banner */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCD0F2] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFE8FA] text-[#3B1B76] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#2E1A5C]">Urgent concern or same-day walk-in?</div>
                <div className="text-[11px] text-[#5C5346]">Call or WhatsApp us directly. Open daily 6:00 AM – 11:30 PM.</div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <a 
                href={`tel:+91${TARGET_PHONE}`} 
                className="flex-1 sm:flex-none py-2 px-3.5 rounded-full text-xs font-bold bg-[#3B1B76] text-white hover:bg-[#2E1460] text-center transition-colors"
              >
                Call Vet
              </a>
              <a 
                href={`https://wa.me/91${TARGET_PHONE}`} 
                target="_blank" 
                rel="noreferrer noopener" 
                className="flex-1 sm:flex-none py-2 px-3.5 rounded-full text-xs font-bold bg-[#42593E] text-white hover:bg-[#344731] text-center transition-colors flex items-center justify-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
          
          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2">
              <CircleAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="appointment-request-form" onSubmit={handleSubmit} className="bg-white rounded-[28px] p-6 sm:p-8 md:p-10 border border-[#E7E0D2] shadow-sm text-left space-y-6">
            
            {/* Form Top Banner */}
            <div className="border-b border-[#F5EEE1] pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B1B76] bg-[#F7F4FC] px-2.5 py-1 rounded-full border border-[#DCD0F2]">
                  Online Request
                </span>
                <span className="text-xs text-[#5C5346] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B9873F]" />
                  <span>Open 6:00 AM – 11:30 PM</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E1A5C] mt-2">
                Request an Appointment
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5346] mt-1">
                Fill out this quick form. Our clinic reception will call or message you to confirm the exact consultation time with Dr. Shashank.
              </p>
            </div>

            {/* 1. Pet Species */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2E1A5C] mb-2">
                1. Pet Species <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5" role="radiogroup">
                {[
                  { type: 'Dog', icon: '🐶', label: 'Dog' },
                  { type: 'Cat', icon: '🐱', label: 'Cat' },
                  { type: 'Other', icon: '🐾', label: 'Other' },
                ].map((item) => {
                  const isSel = petSpecies === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setPetSpecies(item.type)}
                      className={`py-3 px-3 rounded-[14px] text-xs sm:text-sm font-bold border transition-all text-center capitalize min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSel 
                          ? 'bg-[#3B1B76] border-[#3B1B76] text-white shadow-xs' 
                          : 'bg-white border-[#DCD0F2] text-[#4A415C] hover:bg-[#F7F4FC]'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pet's Name */}
            <div>
              <label htmlFor="petName" className="block text-xs font-bold text-[#2E1A5C] mb-1.5">
                Pet's Name <span className="text-red-500">*</span>
              </label>
              <input 
                id="petName"
                type="text"
                required
                placeholder="e.g. Bruno, Bella, Simba"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-4 py-3 rounded-[14px] border text-sm text-[#241C33] min-h-[44px] focus:outline-none focus:ring-2 border-[#DCD0F2] focus:ring-[#3B1B76] bg-white"
              />
            </div>

            {/* Reason for Visit */}
            <div>
              <label htmlFor="reasonForVisit" className="block text-xs font-bold text-[#2E1A5C] mb-1.5">
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <select 
                id="reasonForVisit"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-[14px] border text-sm text-[#241C33] min-h-[44px] bg-white focus:outline-none focus:ring-2 border-[#DCD0F2] focus:ring-[#3B1B76] cursor-pointer"
              >
                <option value="General Consultation / Illness">General Consultation / Illness</option>
                <option value="Vaccination (Puppy/Kitten or Annual Booster)">Vaccination (Puppy/Kitten or Annual Booster)</option>
                <option value="Feline Annual Vaccination Package (₹1,499)">Feline Annual Vaccination Package (₹1,499)</option>
                <option value="Dog Annual Vaccination Bundle (₹2,599)">Dog Annual Vaccination Bundle (₹2,599)</option>
                <option value="Tom Cat Neutering Package (₹9,100)">Tom Cat Neutering Package (₹9,100)</option>
                <option value="Surgical / Spay Consultation">Surgical / Spay Consultation</option>
                <option value="Diagnostics (Blood Test / CBC / Tick Panel)">Diagnostics (Blood Test / CBC / Tick Panel)</option>
                <option value="Digital X-Ray / Orthopaedic Imaging">Digital X-Ray / Orthopaedic Imaging</option>
                <option value="Skin, Ear, or Eye Infection">Skin, Ear, or Eye Infection</option>
                <option value="Deworming & Preventive Healthcare">Deworming & Preventive Healthcare</option>
                <option value="Other Medical Concern">Other Medical Concern</option>
              </select>
            </div>

            {/* Preferred Date & Preferred Time Window (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferredDate" className="block text-xs font-bold text-[#2E1A5C] mb-1.5">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input 
                  id="preferredDate"
                  type="date"
                  required
                  value={prefDate}
                  onChange={(e) => setPrefDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] border text-sm text-[#241C33] min-h-[44px] bg-white focus:outline-none focus:ring-2 border-[#DCD0F2] focus:ring-[#3B1B76]"
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-xs font-bold text-[#2E1A5C] mb-1.5">
                  Preferred Time Window <span className="text-red-500">*</span>
                </label>
                <select 
                  id="preferredTime"
                  required
                  value={prefTime}
                  onChange={(e) => setPrefTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] border text-sm text-[#241C33] min-h-[44px] bg-white focus:outline-none focus:ring-2 border-[#DCD0F2] focus:ring-[#3B1B76] cursor-pointer"
                >
                  <option value="Morning (6:00 AM – 10:00 AM)">Morning (6:00 AM – 10:00 AM)</option>
                  <option value="Mid-day (10:00 AM – 2:00 PM)">Mid-day (10:00 AM – 2:00 PM)</option>
                  <option value="Afternoon (2:00 PM – 6:00 PM)">Afternoon (2:00 PM – 6:00 PM)</option>
                  <option value="Evening (6:00 PM – 9:00 PM)">Evening (6:00 PM – 9:00 PM)</option>
                  <option value="Late Evening (9:00 PM – 11:30 PM)">Late Evening (9:00 PM – 11:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Owner Name & Phone Number (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ownerName" className="block text-xs font-bold text-[#2E1A5C] mb-1.5">
                  Owner / Pet Parent Name <span className="text-red-500">*</span>
                </label>
                <input 
                  id="ownerName"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] border text-sm text-[#241C33] min-h-[44px] focus:outline-none focus:ring-2 border-[#DCD0F2] focus:ring-[#3B1B76] bg-white"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-[#2E1A5C] mb-1.5">
                  Phone / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input 
                  id="phone"
                  type="tel"
                  required
                  placeholder="e.g. 98123 45678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] border text-sm text-[#241C33] min-h-[44px] focus:outline-none focus:ring-2 border-[#DCD0F2] focus:ring-[#3B1B76] bg-white"
                />
              </div>
            </div>

            {/* Notes / Symptoms (Optional) */}
            <div>
              <label htmlFor="notes" className="block text-xs font-bold text-[#2E1A5C] mb-1.5">
                Notes / Symptoms (Optional)
              </label>
              <textarea 
                id="notes"
                rows={3}
                placeholder="Describe any symptoms, duration, prior medication, or special requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-[14px] border border-[#DCD0F2] text-sm text-[#241C33] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B1B76] resize-none"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#DCD0F2] text-[#3B1B76] focus:ring-[#3B1B76] cursor-pointer"
                />
                <span className="text-xs text-[#5C5346] leading-relaxed">
                  I agree to allow Blue Coat Vet to contact me via Call or WhatsApp regarding this appointment request. I understand this request is subject to clinic confirmation. <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2 space-y-3">
              <button 
                type="submit"
                className="w-full py-4 px-6 rounded-full font-bold bg-[#3B1B76] hover:bg-[#2E1460] text-white shadow-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#3B1B76] cursor-pointer"
              >
                <Send className="w-4 h-4 text-purple-200" />
                <span>Submit Appointment Request (Sends to +91 8799730966)</span>
              </button>
              <p className="text-[11px] text-[#5C5346] text-center">
                🔒 No online advance payment required. Clinic reception confirms your slot directly.
              </p>
            </div>

          </form>

          {/* Submission Result Box */}
          {submitted && (
            <div className="mt-6 bg-[#EFE8FA] border border-[#DCD0F2] rounded-[24px] p-6 text-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#3B1B76] shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-base text-[#2E1A5C]">
                    Appointment Request Prepared!
                  </h4>
                  <p className="text-xs font-medium text-[#5C5346]">
                    Redirecting to WhatsApp to send directly to recipient <strong className="font-mono text-[#3B1B76]">+91 {TARGET_PHONE}</strong>:
                  </p>
                </div>
              </div>

              <pre className="bg-white border border-[#DCD0F2] rounded-xl p-4 text-xs font-mono whitespace-pre-wrap text-slate-700 shadow-2xs">
                {generateMessageText()}
              </pre>

              <div className="flex items-center gap-3 flex-wrap pt-1">
                <a 
                  href={`https://api.whatsapp.com/send?phone=91${TARGET_PHONE}&text=${encodeURIComponent(generateMessageText())}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-5 py-2.5 rounded-full bg-[#3B1B76] hover:bg-[#2E1460] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open WhatsApp Direct</span>
                </a>

                <button 
                  type="button"
                  onClick={handleCopyText}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#2E1A5C] font-bold text-xs border border-[#DCD0F2] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Medical & Triage Notice Banner */}
        <div className="max-w-2xl mx-auto my-8">
          <div role="note" aria-label="Medical disclaimer notice" className="flex items-start gap-3 bg-[#F6EDDC] border border-[#E7D3A6] text-[#6B4E1E] p-4 rounded-[14px] text-xs md:text-sm leading-relaxed">
            <CircleAlert className="w-5 h-5 text-[#B9873F] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-[#523A14]">Medical & Triage Notice:</span>
              <p>
                The medical guidance, pet health articles, and concern helper on this website are for educational and informational purposes only. They do not constitute formal veterinary diagnosis or replace in-person clinical examination by a licensed veterinary doctor. If your dog or cat shows signs of acute distress, difficulty breathing, continuous bleeding, or sudden collapse, please contact Blue Coat Vet directly or visit the nearest emergency veterinary hospital immediately.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Accordion Section */}
        <div className="mt-12">
          <section id="faq" className="py-10 bg-[#FDFBF7] rounded-[28px] border border-[#F3E8FF] px-4 sm:px-8">
            <div className="max-w-3xl mb-8 text-center mx-auto">
              <span className="inline-block text-[11px] md:text-xs font-bold uppercase tracking-widest mb-2 text-[#6B46C1]">
                Common questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif leading-tight font-medium text-[#44337A]">
                Appointment & Clinic Visit FAQs
              </h2>
              <p className="mt-2 text-sm text-[#4A5568]">
                Clear answers to common questions about consultations, walk-in emergency visits, and package appointments.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-[#F3E8FF] overflow-hidden transition-all shadow-2xs">
                    <button 
                      type="button" 
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#44337A] hover:text-[#6B46C1] transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <div className="w-8 h-8 rounded-full bg-[#F3E8FF] text-[#6B46C1] flex items-center justify-center shrink-0">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4A5568] leading-relaxed border-t border-[#FAF5FF]">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}
