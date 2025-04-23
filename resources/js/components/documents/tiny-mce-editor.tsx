import { jsPDF } from "jspdf"; // Import jsPDF library
import React, { useRef } from "react";

interface TinyMCEEditorProps {
  id: string;
  initialContent: string;
  onContentChange?: (content: string) => void;
  onInit?: (evt: any, editor: any) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ id, initialContent, onContentChange, onInit }) => {
  const editorRef = useRef<boolean>(false); // To ensure initialization happens only once

  const initializeEditor = () => {
    if (editorRef.current) return; // Prevent re-initialization
    editorRef.current = true;

    const tinymceScript = document.createElement("script");
    tinymceScript.src = "/js/tinymce/tinymce.min.js";
    tinymceScript.async = true;

    const htmlDocxScript = document.createElement("script");
    htmlDocxScript.src = "https://cdn.jsdelivr.net/npm/html-docx-js/dist/html-docx.js";
    htmlDocxScript.async = true;

    const setupEditor = () => {
      window.tinymce.init({
        selector: `#${id}`,
        apiKey: "u348l644l38woikj2xo5cmq1huk2850gmjq4yxim6m1ih6gt",
        height: 500,
        plugins: "exportpdf exportword",
        toolbar:
          "undo redo fontselect  | bold italic | alignleft aligncenter alignright alignjustify | code ",
        branding: false,
        promotion: false,
        noneditable_class: "mceNonEditable",
        setup: (editor: any) => {
          editor.on("init", (evt: any) => {
            editor.setContent(initialContent);
            onInit?.(evt, editor);
          });

          if (onContentChange) {
            editor.on("change", () => {
              onContentChange(editor.getContent());
            });
          }

          editor.ui.registry.addButton("exportToWord", {
            text: "Export to Word",
            onAction: () => exportToWord(editor),
          });

          editor.ui.registry.addButton("printDocument", {
            text: "Print Document",
            onAction: () => printDocument(editor),
          });

          editor.ui.registry.addButton("embedImageFromLink", {
            text: "Embed Image",
            onAction: () => {
              const imageUrl = prompt("Enter image URL:");
              if (imageUrl) {
                editor.insertContent(`<img src="${imageUrl}" alt="Embedded Image" style="max-width: 100%;" />`);
              }
            },
          });
        },
      });
    };

    tinymceScript.onload = () => {
      document.body.appendChild(htmlDocxScript);
      htmlDocxScript.onload = setupEditor;
    };

    document.body.appendChild(tinymceScript);
  };

  // const exportToWord = (editor: any) => {
  //   try {
  //     if (!window.htmlDocx) {
  //       throw new Error("htmlDocx is not loaded.");
  //     }

  //     const editorContent = editor.getContent();
  //     const converted = window.htmlDocx.asBlob(editorContent);

  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(converted);
  //     9;
  //     link.download = `${id}-document.docx`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Export to Word failed:", error);
  //   }
  // };

  const exportToWord = (editor: any) => {
    try {
      if (!window.htmlDocx) {
        throw new Error("htmlDocx is not loaded.");
      }

      const content = editor.getContent({ format: "html" });

      // Ambil semua style dari halaman (jika kamu punya CSS global yang memengaruhi tampilan editor)
      const styles = Array.from(document.styleSheets)
        .map((sheet: any) => {
          try {
            return Array.from(sheet.cssRules || [])
              .map((rule: any) => rule.cssText)
              .join("\n");
          } catch (e) {
            return ""; // skip stylesheets with CORS issues
          }
        })
        .join("\n");

      const fullHTML = `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              ${styles}
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `;

      const converted = window.htmlDocx.asBlob(fullHTML);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(converted);
      link.download = `${id}-document.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export to Word failed:", error);
    }
  };

  const printDocument = (editor: any) => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Failed to open print window.");
      }

      const editorContent = editor.getContent();
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
          </head>
          <body>
            ${editorContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Print document failed:", error);
    }
  };

  // Directly call the initialization function when rendering
  initializeEditor();

  return <textarea id={id}></textarea>;
};

export default TinyMCEEditor;
