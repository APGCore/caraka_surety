import AdminLayout from "@/layouts/admin";
import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import { PengajuanPageProps } from "./pengajuan-page.type";

const PengajuanPage: PengajuanPageProps = () => {
  useEffect(() => {
    const tinymceScript = document.createElement("script");
    tinymceScript.src = "/js/tinymce/tinymce.min.js";

    const htmlDocxScript = document.createElement("script");
    htmlDocxScript.src = "https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js";

    tinymceScript.onload = () => {
      window.tinymce.init({
        selector: "#editor",
        height: 500,
        plugins: "link image code",
        toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code | exportToWordButton",
        promotion: false,
        branding: false,
        setup: (editor) => {
          editor.ui.registry.addButton("exportToWordButton", {
            text: "Export to Word",
            onAction: exportToWord,
          });
          editor.on("init", () => {
            editor.setContent("<p>Ini adalah konten default di TinyMCE.</p>");
          });
        },
      });
    };

    document.body.appendChild(tinymceScript);
    document.body.appendChild(htmlDocxScript);

    return () => {
      document.body.removeChild(tinymceScript);
      document.body.removeChild(htmlDocxScript);
    };
  }, []);

  const exportToWord = () => {
    const content = window.tinymce.get("editor").getContent();
    const converted = window.htmlDocx.asBlob(content);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = "document.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Pengajuan Page</h1>
      <textarea id="editor"></textarea>
    </div>
  );
};

export default PengajuanPage;

PengajuanPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Dashboard Admin"} />
      {page}
    </AdminLayout>
  );
};
