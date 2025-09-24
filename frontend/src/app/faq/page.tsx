"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useGetFAQCategoriesQuery,
  useGetFAQsQuery,
  useAskQuestionMutation,
} from "@/redux/services/faqApi";
import { FAQ, FAQCategory } from "@/types/faq";

const PAGE_SIZE = 8;

export default function FAQPage() {
  const { data: categoriesData = [] } = useGetFAQCategoriesQuery();
  const categories: FAQCategory[] = Array.isArray(categoriesData) ? categoriesData : [];

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: faqs = [], isLoading } = useGetFAQsQuery({
    category: selectedCategory ?? undefined,
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  const totalPages = Math.ceil(faqs.length / PAGE_SIZE);
  const visibleFaqs = useMemo(
    () => faqs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [faqs, page]
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Frequently Asked Questions
      </h1>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <button
          className={`px-5 py-2 rounded-full font-semibold transition ${
            selectedCategory === null
              ? "bg-blue-600 text-white shadow"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat: FAQCategory) => (
          <button
            key={cat.id}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="divide-y rounded-xl shadow bg-white">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading FAQs…</div>
        ) : visibleFaqs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No FAQs found for this category.
          </div>
        ) : (
          visibleFaqs.map((faq: FAQ, idx: number) => (
            <FAQAccordion key={faq.id} faq={faq} defaultOpen={idx === 0 && page === 1} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded border bg-white shadow text-blue-600 font-bold hover:bg-blue-50"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded font-bold ${
                page === i + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-blue-600 border hover:bg-blue-50"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded border bg-white shadow text-blue-600 font-bold hover:bg-blue-50"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <AskQuestionSection />
    </main>
  );
}

function FAQAccordion({
  faq,
  defaultOpen = false,
}: {
  faq: FAQ;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="px-6 py-4 cursor-pointer select-none transition-all">
      <div
        className="flex items-center justify-between gap-4"
        onClick={() => setOpen((v) => !v)}
      >
        <h2 className="text-lg font-semibold text-blue-700">{faq.question}</h2>
        <span className={`transition-transform text-xl ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </div>
      {open && (
        <div className="mt-2 text-gray-700 text-base leading-relaxed animate-fadeIn">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

function AskQuestionSection() {
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [send, { isLoading, isSuccess, isError }] = useAskQuestionMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await send(form);
  };

  return (
    <div className="mt-16">
      <div className="text-xl font-bold text-center mb-2 text-blue-700">
        Didn&apos;t find your answer?
      </div>
      <p className="text-center text-gray-600 mb-4">
        Ask us your question and our team will get back to you soon.
      </p>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-xl rounded-xl p-6 flex flex-col gap-4"
      >
        <input
          className="border border-blue-200 rounded px-4 py-2"
          name="name"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="border border-blue-200 rounded px-4 py-2"
          name="email"
          type="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <textarea
          className="border border-blue-200 rounded px-4 py-2"
          name="question"
          rows={3}
          placeholder="Your Question"
          required
          value={form.question}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-400 via-blue-600 to-cyan-400 text-white font-bold px-8 py-2 rounded-full shadow-lg hover:scale-105 transition"
        >
          {isLoading ? "Sending..." : "Ask a Question"}
        </button>
        {isSuccess && (
          <div className="text-green-700 text-center">
            Thank you! We have received your question.
          </div>
        )}
        {isError && (
          <div className="text-red-700 text-center">
            There was an error. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
