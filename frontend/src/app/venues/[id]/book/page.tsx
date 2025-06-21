"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetVenueByIdQuery } from "@/redux/services/venuesApi";
import VenueGallery from "../../VenueGallery";
import VenueMap from "../../VenueMap";
import { baseAPI } from "@/utils/configs";

const todayStr = new Date().toISOString().split("T")[0];

function getNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const ms = outDate.getTime() - inDate.getTime();
  const nights = ms / (1000 * 60 * 60 * 24);
  return nights > 0 ? nights : 0;
}

export default function VenueBookingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: venue, isLoading, error } = useGetVenueByIdQuery(Number(id));
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    groupSize: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [bookingBreakdown, setBookingBreakdown] = useState<null | {
    price_per_day: number;
    nights: number;
    total: number;
  }>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  const nights = useMemo(
    () => getNights(form.checkIn, form.checkOut),
    [form.checkIn, form.checkOut]
  );
  const isCheckOutInvalid =
    form.checkOut &&
    form.checkIn &&
    new Date(form.checkOut) <= new Date(form.checkIn);

  const totalPrice =
    venue?.price && nights > 0
      ? Number(venue.price) * nights
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isCheckOutInvalid || !venue) return;

    const payload = {
      venue: venue.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      group_size: Number(form.groupSize),
      check_in: form.checkIn,
      check_out: form.checkOut,
      message: form.message,
    };

    const res = await fetch(`${baseAPI}/bookings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      setSubmitted(true);
      setBookingBreakdown(data.breakdown);
    } else {
      alert("Booking failed. Please try again.");
    }
  }

  useEffect(() => { setSubmitted(false); setBookingBreakdown(null); }, [id]);

  if (isLoading)
    return <div className="text-center text-gray-500 py-24">Loading venue details…</div>;
  if (error || !venue)
    return (
      <div className="text-center text-red-600 py-24">
        Venue not found. <Link href="/venues" className="underline text-blue-700">Browse all venues</Link>
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-700 hover:underline">Home</Link>
        {" > "}
        <Link href="/venues" className="text-blue-700 hover:underline">Venues</Link>
        {" > "}
        <span className="text-blue-700 font-bold">Book Venue</span>
      </nav>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <div className="mb-6">
          <VenueGallery images={venue.images} />
        </div>
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{venue.name}</h1>
        <div className="mb-1 text-gray-600 text-sm">
          {venue.town?.name}, {venue.province?.name}
        </div>
        {venue.price && (
          <div className="text-green-700 font-bold text-lg mb-2">
            Daily Rate: {new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(Number(venue.price))} <span className="font-normal text-gray-600">/ per day</span>
          </div>
        )}
        <p className="mb-2 text-gray-700">{venue.description}</p>
        {venue.latitude && venue.longitude && (
          <div className="mb-2">
            <VenueMap lat={venue.latitude} lng={venue.longitude} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Book This Venue</h2>
        <p className="mb-6 text-gray-600">
          Fill in the form below and our team will contact you to confirm your booking and discuss details.
        </p>
        {submitted && bookingBreakdown ? (
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded mb-8">
            <h3 className="text-lg font-bold text-green-700 mb-2">Booking Details:</h3>
            <div>Daily Rate: <b>R {bookingBreakdown.price_per_day}</b></div>
            <div>Nights: <b>{bookingBreakdown.nights}</b></div>
            <div>Total: <b>R {bookingBreakdown.total}</b></div>
            <div className="mt-6 text-green-900 font-bold text-lg">
              Thank you for your booking! Check your email for confirmation and invoice.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <input
                className="border border-blue-200 rounded px-4 py-2"
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={handleChange}
              />
              <input
                className="border border-blue-200 rounded px-4 py-2"
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <input
                className="border border-blue-200 rounded px-4 py-2"
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
                value={form.phone}
                onChange={handleChange}
              />
              <input
                className="border border-blue-200 rounded px-4 py-2"
                type="number"
                name="groupSize"
                placeholder="Group Size"
                required
                min={1}
                value={form.groupSize}
                onChange={handleChange}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <input
                className="border border-blue-200 rounded px-4 py-2"
                type="date"
                name="checkIn"
                placeholder="Check-in Date"
                required
                min={todayStr}
                value={form.checkIn}
                onChange={handleChange}
              />
              <input
                className="border border-blue-200 rounded px-4 py-2"
                type="date"
                name="checkOut"
                placeholder="Check-out Date"
                required
                min={form.checkIn || todayStr}
                value={form.checkOut}
                onChange={handleChange}
                disabled={!form.checkIn}
              />
            </div>
            {isCheckOutInvalid && (
              <div className="text-red-600 text-sm">
                Check-out date must be after check-in date.
              </div>
            )}
            {venue.price && nights > 0 && !isCheckOutInvalid && (
              <div className="text-xl text-blue-800 font-bold text-center py-2">
                Total Price for {nights} {nights === 1 ? "night" : "nights"}:{" "}
                <span className="text-green-600">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  }).format(totalPrice!)}
                </span>
              </div>
            )}
            <textarea
              className="border border-blue-200 rounded px-4 py-2"
              name="message"
              placeholder="Anything else we should know?"
              rows={3}
              value={form.message}
              onChange={handleChange}
            />
            <button
              type="submit"
              disabled={isCheckOutInvalid || nights === 0}
              className="w-full bg-gradient-to-r from-green-400 via-blue-600 to-cyan-400 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Book Venue
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
