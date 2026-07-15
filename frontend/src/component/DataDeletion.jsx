import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ShieldAlert, Trash2, Mail, Phone, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

const DataDeletion = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "No longer using the app",
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Force scroll to top on mount (using robust multi-stage scrolling)
  useEffect(() => {
    const scroll = () => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.scrollTo({ top: 0, behavior: "instant" });
      document.body.scrollTo({ top: 0, behavior: "instant" });
    };

    scroll();
    const t1 = setTimeout(scroll, 50);
    const t2 = setTimeout(scroll, 150);
    const t3 = setTimeout(scroll, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for field when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
      tempErrors.phone = "Please enter a valid phone number (10-12 digits)";
    }

    if (!formData.confirm) {
      tempErrors.confirm = "You must confirm that you understand the terms of data deletion";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "No longer using the app",
        confirm: false,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#43474F] overflow-x-hidden flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full pt-24 pb-16 sm:pt-28 md:pt-32">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          {/* Header text */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-[36px] sm:text-[48px] font-black leading-tight text-[#00284C]">
              Request Account & Data Deletion
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#43474F]/90">
              We value your privacy. If you wish to delete your Jobrito account and permanently erase your data from our servers, please review the conditions and submit the request.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Data Deletion Policy implications (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#efe0d6] shadow-sm space-y-6 text-left">
                <div className="flex items-center gap-3 border-b border-[#efe0d6] pb-3">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                  <h2 className="text-[20px] font-bold text-[#00284C]">
                    Important Information
                  </h2>
                </div>

                <div className="space-y-4 text-[15px] leading-relaxed text-[#43474F]">
                  <p>
                    Please read these conditions carefully before submitting your data deletion request:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li>
                      <strong>Permanent Action:</strong> Once processed, your account will be permanently deleted and cannot be recovered.
                    </li>
                    <li>
                      <strong>Personal Data:</strong> All your profile details, CVs, uploaded chef portfolios, and applications will be erased.
                    </li>
                    <li>
                      <strong>Employer Connections:</strong> Recruiters and employers will no longer be able to view your profile or previous applications.
                    </li>
                    <li>
                      <strong>Active Subscriptions:</strong> Any active packages, job postings, or referrals associated with your account will be terminated.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Support Notice */}
              <div className="bg-[#00284C] text-white rounded-2xl p-6 sm:p-8 shadow-md text-left">
                <h3 className="text-[18px] font-bold text-white mb-2">Have questions?</h3>
                <p className="text-white/80 text-[14px] leading-relaxed">
                  If you are facing login issues or need help managing your account instead of deleting it, please contact our support team at <a href="mailto:support@jobrito.com" className="text-white underline font-medium">support@jobrito.com</a>.
                </p>
              </div>
            </div>

            {/* Right Column: Deletion Request Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#efe0d6] shadow-sm text-left relative overflow-hidden">
                
                {isSuccess ? (
                  /* Success State view */
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#16a34a]/10 flex items-center justify-center text-[#16a34a] mb-6">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-[24px] font-bold text-[#00284C]">Deletion Request Submitted</h3>
                    <p className="mt-3 text-base text-[#43474F] max-w-md mx-auto">
                      Your request to delete your account and personal data has been logged. Our privacy compliance team will verify your registered credentials and process the request within 14 business days.
                    </p>
                    <p className="mt-2 text-sm text-[#43474F]/70">
                      A confirmation email has been sent to your inbox.
                    </p>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-[22px] font-bold text-[#00284C] border-b border-[#efe0d6] pb-3">
                      Request Form
                    </h2>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-[13px] font-bold text-[#00284C] uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full h-[48px] px-4 rounded-lg border bg-[#FFF8F6]/20 text-[15px] transition-all outline-none focus:border-[#00284C] ${
                          errors.name ? "border-red-500 bg-red-50/10" : "border-[#efe0d6]"
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium">
                          <AlertCircle size={14} /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email and Phone Grid */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-[13px] font-bold text-[#00284C] uppercase tracking-wider mb-1.5">
                          Registered Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your registered email address"
                          className={`w-full h-[48px] px-4 rounded-lg border bg-[#FFF8F6]/20 text-[15px] transition-all outline-none focus:border-[#00284C] ${
                            errors.email ? "border-red-500 bg-red-50/10" : "border-[#efe0d6]"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium">
                            <AlertCircle size={14} /> {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-[13px] font-bold text-[#00284C] uppercase tracking-wider mb-1.5">
                          Registered Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your registered phone number"
                          className={`w-full h-[48px] px-4 rounded-lg border bg-[#FFF8F6]/20 text-[15px] transition-all outline-none focus:border-[#00284C] ${
                            errors.phone ? "border-red-500 bg-red-50/10" : "border-[#efe0d6]"
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium">
                            <AlertCircle size={14} /> {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reason for Deletion */}
                    <div>
                      <label htmlFor="reason" className="block text-[13px] font-bold text-[#00284C] uppercase tracking-wider mb-1.5">
                        Reason for Account Deletion
                      </label>
                      <select
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full h-[48px] px-3.5 rounded-lg border border-[#efe0d6] bg-white text-[15px] transition-all outline-none focus:border-[#00284C]"
                      >
                        <option value="No longer using the app">No longer using the app</option>
                        <option value="Privacy concerns">Privacy concerns</option>
                        <option value="Duplicate account">Duplicate account</option>
                        <option value="Technical problems">Technical problems</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="confirm"
                          checked={formData.confirm}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 rounded text-red-600 border-[#efe0d6] focus:ring-red-500"
                        />
                        <span className="text-[14px] text-[#43474F] leading-snug">
                          I understand that this action is permanent. All of my job applications, account profile data, and history will be completely and permanently removed. *
                        </span>
                      </label>
                      {errors.confirm && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium">
                          <AlertCircle size={14} /> {errors.confirm}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 h-[52px] text-[16px] font-bold text-white shadow-sm hover:bg-red-700 transition-all duration-300 disabled:opacity-75 disabled:pointer-events-none hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing Request...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Submit Deletion Request
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DataDeletion;
