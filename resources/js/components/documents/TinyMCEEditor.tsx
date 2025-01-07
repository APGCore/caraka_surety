// Add jsPDF import
import React, { useEffect } from "react";

interface TinyMCEEditorProps {
  id: string;
  initialContent: string;
  onContentChange?: (content: string) => void;
  onInit?: (evt: any, editor: any) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ id, initialContent, onContentChange, onInit }) => {
  useEffect(() => {
    const tinymceScript = document.createElement("script");
    tinymceScript.src = "/js/tinymce/tinymce.min.js";
    tinymceScript.async = true;

    const htmlDocxScript = document.createElement("script");
    htmlDocxScript.src = "https://cdn.jsdelivr.net/npm/html-docx-js/dist/html-docx.js";
    htmlDocxScript.async = true;

    const initializeEditor = () => {
      window.tinymce.init({
        selector: `#${id}`,
        height: 500,
        plugins: "link image code",
        toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code | exportToWord exportToPDF",
        branding: false,
        promotion: false,
        noneditable_class: "mceNonEditable",
        setup: (editor: any) => {
          // Set initial content and trigger onInit
          editor.on("init", (evt: any) => {
            editor.setContent(initialContent);
            if (onInit) {
              onInit(evt, editor);
            }
          });

          // Handle content change
          if (onContentChange) {
            editor.on("change", () => {
              onContentChange(editor.getContent());
            });
          }

          // Add custom button for exporting to Word
          editor.ui.registry.addButton("exportToWord", {
            text: "Export to Word",
            onAction: () => exportToWord(editor),
          });

          // Add custom button for exporting to PDF
          //   editor.ui.registry.addButton("exportToPDF", {
          //     text: "Export to PDF",
          //     onAction: () => exportToPDF(editor),
          //   });
        },
      });
    };

    // Load TinyMCE and initialize
    tinymceScript.onload = () => {
      document.body.appendChild(htmlDocxScript);
      htmlDocxScript.onload = initializeEditor;
    };

    document.body.appendChild(tinymceScript);

    return () => {
      // Cleanup TinyMCE instance and scripts
      if (window.tinymce?.get(id)) {
        window.tinymce.remove(`#${id}`);
      }
      if (document.body.contains(tinymceScript)) {
        document.body.removeChild(tinymceScript);
      }
      if (document.body.contains(htmlDocxScript)) {
        document.body.removeChild(htmlDocxScript);
      }
    };
  }, [id, initialContent, onContentChange, onInit]);

  const exportToWord = (editor: any) => {
    try {
      if (!window.htmlDocx) {
        throw new Error("htmlDocx is not loaded.");
      }

      const editorContent = editor.getContent();
      const converted = window.htmlDocx.asBlob(editorContent);

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

  //   const exportToPDF = (editor: any) => {
  //     try {
  //       const editorContent = editor.getContent();

  //       // Create a new jsPDF instance
  //       const doc = new jsPDF();

  //       // Convert the HTML content to a PDF (You can adjust this to suit your needs)
  //       doc.html(editorContent, {
  //         callback: function (doc: any) {
  //           doc.save(`${id}-document.pdf`);
  //         },
  //         x: 10,
  //         y: 10,
  //       });
  //     } catch (error) {
  //       console.error("Export to PDF failed:", error);
  //     }
  //   };

  return <textarea id={id}></textarea>;
};

export default TinyMCEEditor;
