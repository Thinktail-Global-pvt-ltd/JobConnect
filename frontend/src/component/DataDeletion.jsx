import { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { ShieldAlert, Trash2, Smartphone, Mail, AlertCircle, CheckCircle2, FileText, Lock } from "lucide-react";

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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTo({ top: 0, behavior: "instant" });
    document.body.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      tempErrors.confirm = "You must confirm that you understand the terms of account deletion";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/profile/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          mobile_number: formData.phone,
          email: formData.email,
          name: formData.name,
          reason: formData.reason
        })
      });
    } catch (err) {
      console.log('Account deletion request logged', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "No longer using the app",
        confirm: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full pt-28 pb-16 sm:pt-32 md:pt-36">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Trash2 className="w-3.5 h-3.5" /> Privacy &amp; Data Rights
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Request Account &amp; Data Deletion
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
              In accordance with Google Play &amp; Apple App Store privacy policies and data protection regulations, you can delete your Jobrito account and permanently erase your associated data using either of the methods below.
            </p>
          </div>

          {/* Quick Method Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-10">
            {/* In-App Deletion Card */}
            <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Method 1: Instant In-App Deletion
                </h2>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">
                  You can permanently delete your account directly inside the Jobrito mobile app in just a few taps:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-white/80">
                  <li>Open the <strong>Jobrito App</strong> and log in.</li>
                  <li>Go to <strong>Profile</strong> &rarr; <strong>Settings</strong>.</li>
                  <li>Scroll down and tap <strong>Delete Account</strong>.</li>
                  <li>Confirm the action. Your account, sessions, and data will be erased immediately.</li>
                </ol>
              </div>
            </div>

            {/* Web Request Card */}
            <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Method 2: Web Deletion Request
                </h2>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">
                  If you uninstalled the app or cannot log in, submit the web deletion form below. Our compliance team will verify your registered phone/email and complete the deletion.
                </p>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/70 space-y-1">
                  <p><strong>Processing Time:</strong> Within 48-72 hours</p>
                  <p><strong>Support Email:</strong> jobritoapp@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Data Deletion Policy implications (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card rounded-2xl p-6 sm:p-8 border border-card-border space-y-6 text-left">
                <div className="flex items-center gap-3 border-b border-card-border pb-3">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-bold text-white">
                    What Data Will Be Deleted?
                  </h3>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-white/75">
                  <p>
                    When your account deletion is completed, the following data is permanently wiped from our production database:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li>
                      <strong className="text-white">Profile Data:</strong> Name, phone number, email address, bio, profile photo, and role details.
                    </li>
                    <li>
                      <strong className="text-white">Documents &amp; Portfolios:</strong> Uploaded CVs, resumes, chef portfolios, and media assets.
                    </li>
                    <li>
                      <strong className="text-white">Applications &amp; Interactions:</strong> Job applications, shortlisted records, and contact requests.
                    </li>
                    <li>
                      <strong className="text-white">Authentication &amp; Device Tokens:</strong> API session tokens and Firebase FCM notification device tokens are completely revoked and deleted.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Support Notice */}
              <div className="bg-primary/20 border border-primary/40 text-white rounded-2xl p-6 sm:p-8 text-left">
                <div className="flex items-center gap-2.5 mb-2">
                  <Lock className="w-5 h-5 text-accent" />
                  <h4 className="text-base font-bold text-white">Need Assistance?</h4>
                </div>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  If you need help accessing your account, updating personal information, or have any privacy questions, email our privacy officer at{" "}
                  <a href="mailto:jobritoapp@gmail.com" className="text-accent underline font-medium">
                    jobritoapp@gmail.com
                  </a>.
                </p>
              </div>
            </div>

            {/* Right Column: Deletion Request Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-card rounded-2xl p-6 sm:p-8 border border-card-border text-left relative overflow-hidden">
                
                {isSuccess ? (
                  /* Success State view */
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Deletion Request Submitted</h3>
                    <p className="mt-3 text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                      Your request to delete your Jobrito account and permanently erase your personal data has been logged. Our privacy compliance team will verify your registered phone/email and complete the process.
                    </p>
                    <p className="mt-4 text-xs text-white/50">
                      Confirmation will be communicated to your registered email address.
                    </p>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="border-b border-card-border pb-3">
                      <h3 className="text-xl font-bold text-white">
                        Web Account Deletion Form
                      </h3>
                      <p className="text-xs text-white/60 mt-1">
                        Please provide your registered account details so we can locate and remove your records.
                      </p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full h-12 px-4 rounded-xl border bg-background/50 text-sm text-white placeholder-white/40 transition-all outline-none focus:border-accent ${
                          errors.name ? "border-red-500 bg-red-500/10" : "border-border"
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 font-medium">
                          <AlertCircle size={14} /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email and Phone Grid */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">
                          Registered Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={`w-full h-12 px-4 rounded-xl border bg-background/50 text-sm text-white placeholder-white/40 transition-all outline-none focus:border-accent ${
                            errors.email ? "border-red-500 bg-red-500/10" : "border-border"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 font-medium">
                            <AlertCircle size={14} /> {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">
                          Registered Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 9876543210"
                          className={`w-full h-12 px-4 rounded-xl border bg-background/50 text-sm text-white placeholder-white/40 transition-all outline-none focus:border-accent ${
                            errors.phone ? "border-red-500 bg-red-500/10" : "border-border"
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 font-medium">
                            <AlertCircle size={14} /> {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reason for Deletion */}
                    <div>
                      <label htmlFor="reason" className="block text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">
                        Reason for Account Deletion
                      </label>
                      <select
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-border bg-card text-sm text-white transition-all outline-none focus:border-accent"
                      >
                        <option value="No longer using the app" className="bg-card text-white">No longer using the app</option>
                        <option value="Privacy concerns" className="bg-card text-white">Privacy concerns</option>
                        <option value="Duplicate account" className="bg-card text-white">Duplicate account</option>
                        <option value="Technical problems" className="bg-card text-white">Technical problems</option>
                        <option value="Other" className="bg-card text-white">Other</option>
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
                          className="mt-1 w-4 h-4 rounded text-red-600 border-border focus:ring-red-500 bg-background"
                        />
                        <span className="text-xs text-white/80 leading-relaxed">
                          I understand that this action is permanent. All of my job applications, account profile data, portfolios, and history will be completely and permanently removed. *
                        </span>
                      </label>
                      {errors.confirm && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 font-medium">
                          <AlertCircle size={14} /> {errors.confirm}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 h-12 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-all duration-300 disabled:opacity-75 disabled:pointer-events-none hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing Deletion Request...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Submit Account Deletion Request
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
