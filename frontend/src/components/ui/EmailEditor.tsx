"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color"; // use default import for broad compatibility
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import type { Level as HeadingLevel } from "@tiptap/extension-heading";

type Props = {
  initialHtml?: string;
  onChange: (html: string) => void;
};

// ✅ Use Level[] (mutable array), not readonly tuple, and no casting to number[]
const HEADING_LEVELS: HeadingLevel[] = [1, 2, 3];

export default function EmailEditor({ initialHtml, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false, // avoid SSR hydration mismatches
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: HEADING_LEVELS }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      TextStyle,
      Color,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder: "Write your newsletter here…" }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[260px] " +
          "prose-headings:font-semibold prose-a:underline",
      },
    },
    content:
      initialHtml ||
      `<h1>Monthly Updates</h1><p>Write something engaging…</p><p style="color:#6b7280;font-size:12px;">Unsubscribe: <a href="{{unsubscribe_url}}">{{unsubscribe_url}}</a></p>`,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor) onChange(editor.getHTML());
  }, [editor, onChange]);

  if (!editor) {
    return (
      <div className="border rounded-2xl bg-white p-4">
        <div className="h-[260px] animate-pulse rounded-xl bg-gray-50" />
      </div>
    );
  }

  const promptLink = () => {
    const url = window.prompt("Paste URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertUnsub = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<p style="color:#6b7280;font-size:12px;">Unsubscribe: <a href="{{unsubscribe_url}}">{{unsubscribe_url}}</a></p>`
      )
      .run();
  };

  return (
    <div className="border rounded-2xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2 text-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${editor.isActive("underline") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          U
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {HEADING_LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => editor.chain().focus().toggleHeading({ level: lvl }).run()}
            className={`px-2 py-1 rounded ${
              editor.isActive("heading", { level: lvl }) ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            H{lvl}
          </button>
        ))}

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${editor.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${editor.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          1. List
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className="px-2 py-1 rounded hover:bg-gray-100">
          Left
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className="px-2 py-1 rounded hover:bg-gray-100">
          Center
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className="px-2 py-1 rounded hover:bg-gray-100">
          Right
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button onClick={promptLink} className="px-2 py-1 rounded hover:bg-gray-100">Link</button>
        <button
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          Image
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button onClick={insertUnsub} className="px-2 py-1 rounded border hover:bg-gray-50">
          Insert {"{{unsubscribe_url}}"}
        </button>
      </div>

      {/* Editor */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
