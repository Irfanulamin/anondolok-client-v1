import Image from "next/image";
import { Mail } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 min-h-screen mt-24">
      <div className="mx-auto bg-white p-6 sm:p-8 rounded-lg">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="Anondolok Logo"
            width={120}
            height={120}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-4">
            আনন্দলোক কো-অপারেটিভ সোসাইটি
          </h1>
        </div>

        {/* Introduction */}
        <p className="mb-6 text-lg leading-relaxed text-gray-800">
          আনন্দলোক একটি অরাজনৈতিক, অলাভজনক এবং গণতান্ত্রিক সহযোগিতা ভিত্তিক
          প্রতিষ্ঠান। এটি ২০১৭ খ্রিষ্টাব্দে প্রতিষ্ঠিত হয়। এর লক্ষ্য হলো
          সদস্যদের আর্থিক ও সামাজিক উন্নয়নের মাধ্যমে একটি সহযোগিতামূলক সমাজ গঠন
          করা।
        </p>

        {/* Objectives */}
        <h2 className="text-2xl font-semibold mb-3 text-green-900">
          উদ্দেশ্য:
        </h2>
        <ul className="list-disc list-inside mb-6 space-y-1 text-lg text-gray-700">
          <li>সদস্যদের নিয়মিত সঞ্চয় নিশ্চিত করা</li>
          <li>সঞ্চিত অর্থ লাভজনক খাতে বিনিয়োগ</li>
          <li>সামাজিক ও কল্যাণমূলক প্রকল্পে সক্রিয় অংশগ্রহণ</li>
          <li>সমষ্টিগত পরিকল্পনা গ্রহণ ও বাস্তবায়ন</li>
        </ul>

        {/* Membership */}
        <h2 className="text-2xl font-semibold mb-3 text-green-900">সদস্যপদ:</h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-800">
          শুধুমাত্র ঢাকা বিশ্ববিদ্যালয়ের শিক্ষা ও গবেষণা ইন্সটিটিউট (আইইআর)
          থেকে স্নাতক (সম্মান) ডিগ্রীধারী ব্যক্তি এই সংগঠনের সদস্য হতে পারেন।
          সদস্য সংখ্যা সর্বাধিক ৫০ জন। সদস্য হওয়ার জন্য প্রাথমিক সঞ্চয় ও মাসিক
          সঞ্চয় বাধ্যতামূলক। সময়মতো সঞ্চয়ের অর্থ প্রদান না করলে জরিমানা আরোপ
          করা হয় এবং নির্দিষ্ট শর্তে সদস্যপদ বাতিলের ব্যবস্থাও আছে।
        </p>

        {/* Management Committee */}
        <h2 className="text-2xl font-semibold mb-3 text-green-900">
          পরিচালনা কমিটি
        </h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800">
          আনন্দলোক পরিচালনা করে একটি ৬ সদস্য বিশিষ্ট নির্বাহী কমিটি যা প্রতি দুই
          বছর অন্তর সদস্যদের ভোটে নির্বাচন করা হয়। কমিটির সদস্যপদগুলো হলো:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-1 text-lg text-gray-700">
          <li>সভাপতি</li>
          <li>সহ-সভাপতি</li>
          <li>অর্থ সম্পাদক</li>
          <li>দপ্তর সম্পাদক</li>
          <li>প্রচার সম্পাদক</li>
          <li>সদস্য (নির্বাচিত কমিটির সদস্যদের দ্বারা মনোনীত)</li>
        </ul>
        <p className="mb-6 text-lg leading-relaxed text-gray-800">
          এই কমিটি সঞ্চয় ব্যবস্থাপনা, বিনিয়োগ, ঋণ প্রদান, বার্ষিক সভা এবং
          নীতিনির্ধারণী সিদ্ধান্ত গ্রহণে জবাবদিহিতার সাথে কাজ করে।
        </p>

        {/* Savings Management and Investment */}
        <h2 className="text-2xl font-semibold mb-3 text-green-900">
          সঞ্চয় ব্যবস্থাপনা ও বিনিয়োগ
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-800">
          সদস্যদের জমাকৃত অর্থ একটি নির্দিষ্ট ব্যাংক অ্যাকাউন্টে রাখা হয় এবং
          প্রয়োজনে সদস্যদের মাঝে ঋণ হিসেবে প্রদান করা হয়। এছাড়াও লাভজনক
          প্রকল্পে বিনিয়োগের মাধ্যমে সংগঠনের তহবিলকে শক্তিশালী করা হয়।
        </p>

        {/* Annual General Meeting */}
        <h2 className="text-2xl font-semibold mb-3 text-green-900">
          বার্ষিক সাধারণ সভা
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-800">
          প্রতি বছর একটি বার্ষিক সাধারণ সভা (AGM) অনুষ্ঠিত হয় যেখানে সদস্যদের
          মতামত গ্রহণ, বার্ষিক প্রতিবেদন উপস্থাপন এবং পরবর্তী বছরের পরিকল্পনা
          নির্ধারণ করা হয়। বার্ষিক সাধারণ সভায় সকল সদস্যের অংশগ্রহণ
          গুরুত্বপূর্ণ এবং বাধ্যতামূলক।
        </p>

        {/* Contact */}
        <h2 className="text-2xl font-semibold mb-3 text-green-900">যোগাযোগ:</h2>
        <div className="flex items-center gap-2 text-lg">
          <Mail className="w-8 h-8 text-black" />
          <span className="text-lg font-semibold text-blue-900">
            anondolok2017@gmail.com
          </span>
        </div>
      </div>
    </div>
  );
}
