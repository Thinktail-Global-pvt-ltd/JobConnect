import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

const HelpSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "Professional",
    subject: "Account Support",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Force scroll to top on mount
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.message.trim()) {
      tempErrors.message = "Message or description is required";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message should be at least 10 characters long";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/support-ticket", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType,
        subject: formData.subject,
        message: formData.message
      });

      if (response.data.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          userType: "Professional",
          subject: "Account Support",
          message: "",
        });
      } else {
        alert(response.data.message || "Failed to submit enquiry.");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(" ") 
        : (err.response?.data?.message || "Something went wrong. Please try again.");
      alert(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#43474F] overflow-x-hidden flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full pt-24 pb-16 sm:pt-28 md:pt-32">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          {/* Header text */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-[36px] sm:text-[48px] font-black leading-tight text-[#00284C]">
              Help & Support Center
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#43474F]/90">
              Have questions, feedback, or need assistance with Jobrito? Fill out the form below or reach us directly. Our team is here to support you.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Contact details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#efe0d6] shadow-sm space-y-6 text-left">
                <h2 className="text-[22px] font-bold text-[#00284C] border-b border-[#efe0d6] pb-3">
                  Contact Information
                </h2>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#00284C]/5 flex items-center justify-center text-[#00284C] flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#00284C]">Email Us</h4>
                      <p className="text-[15px] text-[#43474F] mt-0.5">support@jobrito.com</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* FAQ Highlight Box */}
              <div className="bg-[#00284C] text-white rounded-2xl p-6 sm:p-8 shadow-md text-left">
                <h3 className="text-[18px] font-bold text-white mb-2">Need a Quick Answer?</h3>
                <p className="text-white/80 text-[14px] leading-relaxed">
                  Check out our general guidelines and privacy policy for details on account setup, job applications, and safety practices.
                </p>
              </div>
            </div>

            {/* Right Column: Support Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#efe0d6] shadow-sm text-left relative overflow-hidden">
                
                {isSuccess ? (
                  /* Success State view */
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#16a34a]/10 flex items-center justify-center text-[#16a34a] mb-6">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-[24px] font-bold text-[#00284C]">Enquiry Submitted!</h3>
                    <p className="mt-3 text-base text-[#43474F] max-w-md mx-auto">
                      Thank you for contacting Jobrito. Your ticket has been logged and our support team will get back to you within 24-48 business hours.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#00284C] px-6 py-3 text-[15px] font-bold text-white shadow-sm hover:bg-[#001c36] transition-all duration-300"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-[22px] font-bold text-[#00284C] border-b border-[#efe0d6] pb-3">
                      Submit a Support Ticket
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
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
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
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
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

                    {/* Role & Support Type Dropdowns */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* User Type */}
                      <div>
                        <label htmlFor="userType" className="block text-[13px] font-bold text-[#00284C] uppercase tracking-wider mb-1.5">
                          I am a...
                        </label>
                        <select
                          id="userType"
                          name="userType"
                          value={formData.userType}
                          onChange={handleChange}
                          className="w-full h-[48px] px-3.5 rounded-lg border border-[#efe0d6] bg-white text-[15px] transition-all outline-none focus:border-[#00284C]"
                        >
                          <option value="Professional">Job Seeker / Professional</option>
                          <option value="Employer">Employer / Business Owner</option>
                          <option value="Chef">Chef / Culinary Consultant</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Subject Category */}
                      <div>
                        <label htmlFor="subject" className="block text-[13px] font-bold text-[#00284C] uppercase tracking-wider mb-1.5">
                          Support Category
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full h-[48px] px-3.5 rounded-lg border border-[#efe0d6] bg-white text-[15px] transition-all outline-none focus:border-[#00284C]"
                        >
                          <option value="Account Support">Account & Login Support</option>
                          <option value="Jobs Support">Jobs & Applications</option>
                          <option value="Hiring Support">Hiring & Employer Tools</option>
                          <option value="Chef Connect Query">Chef Connect Queries</option>
                          <option value="Tech Issue">Technical Issue</option>
                          <option value="General Query">General Inquiries</option>
                        </select>
                      </div>
                    </div>

                    {/* Message / Description */}
                    <div>
                      <label htmlFor="message" className="block text-[13px] font-bold text-[#00284C] uppercase tracking-wider mb-1.5">
                        Message Description *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter details of your query..."
                        className={`w-full px-4 py-3 rounded-lg border bg-[#FFF8F6]/20 text-[15px] transition-all outline-none focus:border-[#00284C] resize-none ${
                          errors.message ? "border-red-500 bg-red-50/10" : "border-[#efe0d6]"
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-medium">
                          <AlertCircle size={14} /> {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#639ECF] h-[52px] text-[16px] font-bold text-white shadow-sm hover:bg-[#528dbd] transition-all duration-300 disabled:opacity-75 disabled:pointer-events-none hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting Enquiry...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Submit Enquiry
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

export default HelpSupport;
