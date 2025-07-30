import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="bg-white py-12 px-6 md:px-16 max-w-6xl mx-auto my-44">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <Image
          src="/logo.png"
          alt="Anondolok Logo"
          width={120}
          height={120}
          className="mb-4"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">আনন্দলোক</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          এক্স-আইইআরিয়ান কো-অপারেটিভ সোসাইটি। আমাদের লক্ষ্য সদস্যদের আর্থিক ও
          সামাজিক উন্নয়নের মাধ্যমে একটি সহযোগিতামূলক সমাজ গঠন।
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
          আমাদের লক্ষ্য
        </h2>
        <p className="text-gray-700 leading-relaxed">
          আনন্দলোক একটি অরাজনৈতিক, অলাভজনক এবং গণতান্ত্রিক সহযোগিতা ভিত্তিক
          প্রতিষ্ঠান। এর মূল উদ্দেশ্য হলো:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
          <li>সদস্যদের নিয়মিত সঞ্চয় নিশ্চিত করা</li>
          <li>সঞ্চিত অর্থ লাভজনক খাতে বিনিয়োগ</li>
          <li>সামাজিক ও কল্যাণমূলক প্রকল্পে সক্রিয় অংশগ্রহণ</li>
          <li>সমষ্টিগত পরিকল্পনা গ্রহণ ও বাস্তবায়ন</li>
        </ul>
      </div>

      {/* Membership */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">সদস্যপদ</h2>
        <p className="text-gray-700 leading-relaxed">
          শুধুমাত্র ঢাকা বিশ্ববিদ্যালয়ের ইনস্টিটিউট অব এডুকেশন অ্যান্ড রিসার্চ
          (IER) থেকে স্নাতক প্রাপ্তরা এই সংগঠনের সদস্য হতে পারেন। সদস্য সংখ্যা
          সর্বাধিক ৫০ জন। সদস্য হওয়ার জন্য প্রাথমিক সঞ্চয় ও মাসিক সঞ্চয়
          বাধ্যতামূলক।
        </p>
        <p className="mt-2 text-gray-700">
          সময়মতো সঞ্চয় প্রদান না করলে জরিমানা আরোপ করা হয় এবং নির্দিষ্ট শর্তে
          সদস্যপদ বাতিলের ব্যবস্থাও আছে।
        </p>
      </div>

      {/* Committee Structure */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
          পরিচালনা কমিটি
        </h2>
        <p className="text-gray-700 leading-relaxed">
          আনন্দলোক পরিচালনা করে একটি ৫ সদস্য বিশিষ্ট কমিটি। তারা প্রতি দুই বছর
          অন্তর নির্বাচিত হন। সদস্যরা হলেন:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
          <li>সভাপতি</li>
          <li>সহ-সভাপতি</li>
          <li>কোষাধ্যক্ষ</li>
          <li>দপ্তর সম্পাদক</li>
          <li>প্রচার সম্পাদক</li>
        </ul>
        <p className="mt-2 text-gray-700">
          এই কমিটি সঞ্চয় ব্যবস্থাপনা, ঋণ প্রদান, বার্ষিক সভা এবং নীতিনির্ধারণী
          সিদ্ধান্ত গ্রহণে জবাবদিহিতার সাথে কাজ করে।
        </p>
      </div>

      {/* Financial Policy */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
          অর্থনীতি ও বিনিয়োগ
        </h2>
        <p className="text-gray-700 leading-relaxed">
          সদস্যদের জমাকৃত অর্থ একটি নির্দিষ্ট ব্যাংক অ্যাকাউন্টে রাখা হয় এবং
          প্রয়োজনে সদস্যদের মাঝে ঋণ হিসেবে প্রদান করা হয়। এছাড়াও লাভজনক
          প্রকল্পে বিনিয়োগের মাধ্যমে সংগঠনের তহবিলকে শক্তিশালী করা হয়।
        </p>
      </div>

      {/* Annual Meeting */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
          বার্ষিক সাধারন সভা
        </h2>
        <p className="text-gray-700 leading-relaxed">
          প্রতি বছর একটি বার্ষিক সাধারণ সভা (AGM) অনুষ্ঠিত হয় যেখানে সদস্যদের
          মতামত গ্রহণ, প্রতিবেদন উপস্থাপন এবং পরবর্তী বছরের পরিকল্পনা নির্ধারণ
          করা হয়। উপস্থিতির জন্য সকল সদস্যের অংশগ্রহণ গুরুত্বপূর্ণ।
        </p>
      </div>

      {/* Contact / Social */}
      <div>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">যোগাযোগ</h2>
        <p className="text-gray-700 leading-relaxed">
          আনন্দলোক এর সমস্ত তথ্য একটি রেজিস্টার ও ফেসবুক গ্রুপে সংরক্ষিত থাকে।
          সদস্যদের মধ্যে মতবিনিময়, নোটিশ, আর্থিক বিবরণ এবং পরিকল্পনার তথ্য
          এখানে প্রকাশিত হয়।
        </p>
      </div>
    </div>
  );
}
