import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const PlansPage = () => {
  const officialPlans = [
    {
      id: "p1",
      title: "21-Day Cell Shepherding Devotional",
      duration: "21 Days",
      enrolledCount: 142,
      category: "Shepherding",
      description: "Daily reading chapters covering foundational pastoral care, cell multiplication, and member follow-up.",
      currentDay: 8,
    },
    {
      id: "p2",
      title: "Mega Gathering Mobilization Study",
      duration: "14 Days",
      enrolledCount: 88,
      category: "Evangelism",
      description: "Structured schedule focusing on anagkazo busing, outreach logistics, and prayer for church harvest.",
      currentDay: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            Spiritual Development
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Official Reading Plans</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Join structured literature schedules with daily progress checkpoints across all church zones.
          </p>
        </div>

        <div className="space-y-6">
          {officialPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border border-stone-200/90 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-teal-300 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {plan.category}
                  </span>
                  <span className="text-xs text-stone-400">&bull; {plan.duration}</span>
                  <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-teal-700" /> {plan.enrolledCount} Readers Enrolled
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{plan.title}</h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <Link
                to="/read/doc-1"
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-xs shrink-0"
              >
                {plan.currentDay ? `Continue Day ${plan.currentDay}` : "Start Plan"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
