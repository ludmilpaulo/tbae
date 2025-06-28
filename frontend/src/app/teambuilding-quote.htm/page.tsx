"use client";

export default function QuotePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Request a Quote</h1>
      <p className="mb-6 text-gray-600">
        Fill in your details below and our team will get back to you with a personalized quote for your event, team building, or venue booking.
      </p>
      <div className="mt-10">
       
        <iframe
          title="TBAE Quote request"
          src="https://tbaeza.clientary.com/forms/139151/docview"
          width="100%"
          height="700"
          scrolling="no"
          frameBorder={0}
          allowTransparency={true}
          style={{ border: "none", minHeight: 700, width: "100%" }}
        />
        <div className="text-gray-400 text-xs text-center mt-2">
          This is a secure form powered by Clientary.
        </div>
      </div>
    </main>
  );
}
