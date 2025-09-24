"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { listLists, listSubscribersByList, createTemplate, createCampaign, sendCampaign } from "@/lib/newsletter";
import type { ListRow, SubscriberRow } from "@/types/newsletter";

const EmailEditor = dynamic(() => import("@/components/ui/EmailEditor"), { ssr: false });
type Mode = "all" | "selected";

export default function NewsletterComposerPage() {
  const [lists, setLists] = useState<ListRow[]>([]);
  const [listId, setListId] = useState<number | "">("");
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");

  const [mode, setMode] = useState<Mode>("all");
  const [subs, setSubs] = useState<SubscriberRow[]>([]);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  const [loadingLists, setLoadingLists] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  // 1) Fetch lists once
  useEffect(() => {
    (async () => {
      setLoadingLists(true);
      try {
        const ls = await listLists();
        setLists(ls);
      } catch (e) {
        setToast({ kind: "err", msg: (e as Error).message });
      } finally {
        setLoadingLists(false);
      }
    })();
  }, []);

  // 2) Pick default list when lists arrive (and no list chosen yet)
  useEffect(() => {
    if (!listId && lists.length > 0) {
      setListId(lists[0].id);
    }
  }, [lists, listId]);

  // 3) Load subscribers when list changes
  useEffect(() => {
    if (!listId) {
      setSubs([]);
      setPicked(new Set());
      return;
    }
    setLoadingSubs(true);
    listSubscribersByList(Number(listId))
      .then(setSubs)
      .catch((e) => setToast({ kind: "err", msg: (e as Error).message }))
      .finally(() => setLoadingSubs(false));
  }, [listId]);

  const filteredSubs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subs;
    return subs.filter((s) =>
      s.email.toLowerCase().includes(q) ||
      (s.first_name && s.first_name.toLowerCase().includes(q)) ||
      (s.last_name && s.last_name.toLowerCase().includes(q))
    );
  }, [subs, search]);

  async function onSend() {
    if (!listId) return setToast({ kind: "err", msg: "Choose a list." });
    if (!fromEmail.trim()) return setToast({ kind: "err", msg: "Set a From email." });
    if (!subject.trim()) return setToast({ kind: "err", msg: "Set a subject." });
    if (!html.includes("{{unsubscribe_url}}")) {
      return setToast({ kind: "err", msg: "Add {{unsubscribe_url}} in the footer." });
    }
    if (mode === "selected" && picked.size === 0) {
      return setToast({ kind: "err", msg: "Pick at least one recipient or switch to All." });
    }

    setSending(true);
    try {
      const template = await createTemplate({
        name: `T-${new Date().toISOString().slice(0, 16)}`,
        subject,
        html,
      });
      const campaign = await createCampaign({
        name: `C-${new Date().toISOString().slice(0, 16)}`,
        list: Number(listId),
        template: template.id,
        from_email: fromEmail.trim(),
      });
      const res = await sendCampaign(
        campaign.id,
        mode,
        mode === "selected" ? Array.from(picked) : undefined
      );
      setToast({
        kind: "ok",
        msg: res.enqueued ? `Campaign #${res.campaign_id} queued.` : `Campaign #${res.campaign_id} sent.`,
      });
      if (mode === "selected") setPicked(new Set());
    } catch (e) {
      setToast({ kind: "err", msg: (e as Error).message });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Newsletter Composer</h1>
      <p className="text-gray-600">Write with a rich editor and send to your subscribers.</p>

      {toast && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            toast.kind === "ok"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-600">List</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                  value={listId}
                  onChange={(e) => setListId(e.target.value ? Number(e.target.value) : "")}
                  disabled={loadingLists}
                >
                  {!listId && <option value="">— select —</option>}
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} (#{l.id}) — {l.subscribers_count} subs
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">From email</span>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="news@yourdomain.com"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-gray-600">Subject</span>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder="Monthly updates…"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>

            <EmailEditor onChange={setHtml} />
            <div className="text-xs text-gray-500">
              Keep <code className="bg-gray-50 rounded px-1">{`{{unsubscribe_url}}`}</code> in the footer. Backend injects each recipient’s personal link.
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">Recipients</div>
              <div className="flex items-center gap-5">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="all"
                    checked={mode === "all"}
                    onChange={() => setMode("all")}
                  />
                  <span className="text-sm">Send to all</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="selected"
                    checked={mode === "selected"}
                    onChange={() => setMode("selected")}
                    disabled={loadingSubs || subs.length === 0}
                  />
                  <span className="text-sm">Send to selected</span>
                </label>
              </div>
            </div>

            {mode === "selected" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <input
                    className="rounded-xl border px-3 py-2 text-sm flex-1"
                    placeholder="Search subscribers…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={picked.size === subs.length && subs.length > 0}
                      onChange={(e) =>
                        setPicked(
                          e.target.checked ? new Set(subs.map((s) => s.id)) : new Set()
                        )
                      }
                      disabled={loadingSubs || subs.length === 0}
                    />
                    <span>Select all</span>
                  </label>
                </div>

                {loadingSubs ? (
                  <div className="text-sm text-gray-500">Loading subscribers…</div>
                ) : subs.length === 0 ? (
                  <div className="text-sm text-gray-500">No subscribers in this list.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-auto pr-1">
                    {filteredSubs.map((s) => {
                      const name =
                        [s.first_name, s.last_name].filter(Boolean).join(" ") || s.email;
                      const checked = picked.has(s.id);
                      return (
                        <label
                          key={s.id}
                          className={`flex items-center justify-between gap-3 px-3 py-2 border rounded-xl ${
                            checked ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-50`}
                        >
                          <div className="truncate">
                            <div className="font-medium truncate">{name}</div>
                            <div className="text-xs text-gray-500 truncate">{s.email}</div>
                          </div>
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={checked}
                            onChange={() => {
                              const n = new Set(picked);
                              if (n.has(s.id)) {
                                n.delete(s.id);
                              } else {
                                n.add(s.id);
                              }
                              setPicked(n);
                            }}
                          />
                        </label>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-1">
                  <span className="text-sm text-gray-600">
                    Selected: <strong>{picked.size}</strong> / {subs.length}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onSend}
                disabled={sending || !listId}
                className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
              >
                {sending ? "Sending…" : mode === "selected" ? "Send to selected" : "Send to all"}
              </button>
            </div>
          </div>
        </div>

        {/* Live HTML preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border shadow-sm p-5 sticky top-6">
            <div className="text-sm text-gray-500">Preview</div>
            <div className="font-medium break-all">{subject || "— subject —"}</div>
            <div className="text-xs text-gray-500 mt-1">From: {fromEmail || "— from —"}</div>
            <div className="mt-3 rounded-xl border overflow-hidden">
              <iframe
                title="email-preview"
                className="w-full h-[520px]"
                srcDoc={
                  html || "<p style='padding:12px;color:#6b7280'>Start typing in the editor…</p>"
                }
              />
            </div>
            <div className="text-xs text-gray-500 mt-3">
              Backend sanitizes + inlines CSS, adds open pixel, and tracks clicks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
