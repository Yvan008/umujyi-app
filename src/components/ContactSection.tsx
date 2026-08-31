import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { businessSettings, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been sent to our Kigali support team!', 'success');
  };

  return (
    <div className="py-12 sm:py-16 bg-[#F5F5F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight mb-2">
            GET IN TOUCH WITH UMUJYI
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base">
            Have questions about an order, catering events, or partnership inquiries? We are always here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Branches */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-black text-[#111111]">Direct Contacts</h2>

              <div className="space-y-4">
                <a
                  href={`tel:${businessSettings.phone}`}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#F51B55] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">Customer Support Line</p>
                    <p className="text-sm font-black text-[#111111]">{businessSettings.phone}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${businessSettings.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">WhatsApp Ordering</p>
                    <p className="text-sm font-black text-[#111111]">Chat with Support Agent</p>
                  </div>
                </a>

                <a
                  href={`mailto:${businessSettings.email}`}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">Email Us</p>
                    <p className="text-sm font-black text-[#111111]">{businessSettings.email}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Kigali Kitchen Locations */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-[#111111]">Kigali Branches</h2>
              <div className="space-y-3">
                <div className="p-3 bg-neutral-50 rounded-2xl">
                  <p className="font-bold text-sm text-[#111111]">Kimihurura Flagship Hub</p>
                  <p className="text-xs text-neutral-500">KG 622 St, Plot 14 (Near Kigali Convention Centre)</p>
                  <p className="text-[11px] text-[#F51B55] font-semibold mt-1">Open 10:00 AM - 11:30 PM Daily</p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-2xl">
                  <p className="font-bold text-sm text-[#111111]">Nyarutarama Cloud Kitchen</p>
                  <p className="text-xs text-neutral-500">KG 9 Ave, Nyarutarama Plaza</p>
                  <p className="text-[11px] text-[#F51B55] font-semibold mt-1">Open 10:30 AM - 11:00 PM Daily</p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-2xl">
                  <p className="font-bold text-sm text-[#111111]">Downtown CBD Express Hub</p>
                  <p className="text-xs text-neutral-500">KN 4 Ave, Grand Pension Plaza Floor 1</p>
                  <p className="text-[11px] text-[#F51B55] font-semibold mt-1">Open 09:30 AM - 09:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Catering Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
            <h2 className="text-xl font-black text-[#111111] mb-2">Send Us a Message</h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              Fill out the form below and our Kigali hospitality team will respond within 2 hours.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-black text-emerald-900 mb-1">Message Received!</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto mb-4">
                  Thank you for reaching out. An Umujyi customer representative will contact you via email or phone shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jean Damascene"
                      required
                      className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F51B55]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. jean@example.com"
                      required
                      className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F51B55]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#F51B55]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Catering & Bulk Order">Catering & Corporate Bulk Orders</option>
                    <option value="Feedback & Quality">Feedback / Order Experience</option>
                    <option value="Job Application">Career / Rider Application</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message or catering requirements here..."
                    required
                    className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F51B55]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F51B55] hover:bg-[#d41446] text-white font-extrabold text-sm sm:text-base py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
