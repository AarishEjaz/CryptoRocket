import React, { useState } from "react";
import {
  Headphones,
  MessageSquare,
  AlertCircle,
  Send,
  CheckCircle,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import { toast } from "react-toastify";
import { createTicket } from "../../api/user.api";

const RaiseTicket = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    natureOfComplain: "",
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message || !formData.natureOfComplain) {
      console.log("Error: Please fill all fields");
      return;
    }
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      const response = await createTicket(formData);
      if (response?.success) {
        toast.success(response?.message || "Ticket raised successfully");
        setFormData({ subject: "", message: "", natureOfComplain: "" });
      } else {
        toast.error("Error raising ticket:", response?.message);
      }
    } catch (error) {
      console.error("Error raising ticket:", error);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const complaintOptions = [
    { value: "transaction", label: "💳 Transaction Issue", icon: "💳" },
    { value: "withdrawal", label: "💰 Withdrawal Issue", icon: "💰" },
    { value: "deposit", label: "📈 Deposit Issue", icon: "📈" },
    { value: "account", label: "👤 Account Related", icon: "👤" },
    { value: "technical", label: "🔧 Technical Issue", icon: "🔧" },
    { value: "other", label: "❓ Other", icon: "❓" },
  ];

  const isFormValid =
    formData.subject && formData.message && formData.natureOfComplain;

  return (
    <div className="p-6 w-full">
      <div className="max-w-4xl mx-auto relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-cyan-600/5 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>

        <div className="relative border border-blue-800/30 shadow-2xl rounded-3xl p-8 hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
          {/* Header Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl shadow-lg shadow-blue-500/10">
                <Headphones className="w-8 h-8 text-blue-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                Raise a Support Ticket
              </h2>
              <p className="text-slate-400 text-base">
                Our dedicated support team is here to help you 24/7. We
                typically respond within 2-4 hours.
              </p>
            </div>
          </div>

          {/* Support Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/30 border border-slate-700/30 p-4 rounded-xl hover:border-blue-600/30 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-semibold text-white text-sm">
                    Response Time
                  </div>
                  <div className="text-xs text-slate-400">2-4 hours</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/30 p-4 rounded-xl hover:border-blue-600/30 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-semibold text-white text-sm">
                    Support Available
                  </div>
                  <div className="text-xs text-slate-400">
                    24/7 Live Support
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/30 p-4 rounded-xl hover:border-blue-600/30 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="font-semibold text-white text-sm">
                    Resolution Rate
                  </div>
                  <div className="text-xs text-slate-400">99.8% Success</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Ticket Subject
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter a clear subject line"
                    className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 group-hover:border-blue-600/30"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Nature of Complaint */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  Issue Category
                </label>
                <div className="relative">
                  <select
                    name="natureOfComplain"
                    value={formData.natureOfComplain}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 group-hover:border-blue-600/30 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-800">
                      Select issue category
                    </option>
                    {complaintOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-slate-800"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Detailed Description
              </label>
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your issue in detail. Include any relevant information like transaction IDs, error messages, or steps you've already tried..."
                  rows={6}
                  className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 group-hover:border-blue-600/30 resize-none"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-slate-500">
                  Be as specific as possible for faster resolution
                </span>
                <span className="text-xs text-slate-500">
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            {/* Form Summary */}
            {isFormValid && (
              <div className="p-5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  Ticket Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 min-w-20">Subject:</span>
                    <span className="text-white font-medium">
                      {formData.subject}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 min-w-20">Category:</span>
                    <span className="text-cyan-400 font-medium">
                      {
                        complaintOptions.find(
                          (opt) => opt.value === formData.natureOfComplain
                        )?.label
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                onClick={handleSubmit}
                className={`relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group min-w-48 ${
                  isLoading || !isFormValid
                    ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/30"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] border border-blue-500/30"
                }`}
              >
                <div className="relative flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Support Ticket</span>
                    </>
                  )}
                </div>

                {/* Button glow effect */}
                {!isLoading && isFormValid && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                )}
              </button>
            </div>
          </div>

          {/* Help Notice */}
          <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-400">
                <p className="mb-2">
                  <strong className="text-white">
                    Need immediate assistance?
                  </strong>{" "}
                  For urgent issues, you can also reach us via live chat or call
                  our emergency support line.
                </p>
                <p>
                  All tickets are tracked and you'll receive email updates on
                  the progress of your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseTicket;
