import React, { useEffect } from "react";

interface TinyMCEEditorProps {
  id: string;
  initialContent: string;
  onContentChange?: (content: string) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ id, initialContent, onContentChange }) => {
  useEffect(() => {
    const tinymceScript = document.createElement("script");
    tinymceScript.src = "/js/tinymce/tinymce.min.js";

    const htmlDocxScript = document.createElement("script");
    htmlDocxScript.src = "https://cdn.jsdelivr.net/npm/html-docx-js/dist/html-docx.js";

    tinymceScript.onload = () => {
      htmlDocxScript.onload = () => {
        window.tinymce.init({
          selector: `#${id}`,
          height: 500,
          plugins: "link image code",
          toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code | exportToWord",
          branding: false,
          promotion: false,
          setup: (editor: any) => {
            // Set initial content
            editor.on("init", () => {
              editor.setContent(initialContent);
            });

            // Handle content change if provided
            if (onContentChange) {
              editor.on("change", () => {
                onContentChange(editor.getContent());
              });
            }

            // Menambahkan tombol kustom ke toolbar
            editor.ui.registry.addButton("exportToWord", {
              text: "Export to Word",
              onAction: () => {
                exportToWord(editor);
              },
            });
          },
        });
      };
      document.body.appendChild(htmlDocxScript);
    };

    document.body.appendChild(tinymceScript);

    return () => {
      if (window.tinymce?.get(id)) {
        window.tinymce.remove(`#${id}`);
      }
      document.body.removeChild(tinymceScript);
      if (htmlDocxScript.parentElement) {
        document.body.removeChild(htmlDocxScript);
      }
    };
  }, [id, initialContent, onContentChange]);

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

  return <textarea id={id}></textarea>;
};

export default TinyMCEEditor;
