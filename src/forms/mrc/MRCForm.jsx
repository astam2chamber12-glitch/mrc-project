import { useState } from "react";
import formSchema from "./mrc.json";

export default function MRCForm() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLES DOWNLOADING AS ACTUAL CLIENT-SIDE PDF
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA:", formData);

    const element = document.querySelector(".print-page");
    
    const opt = {
      margin: 0,
      filename: `Marriage_Certificate_${formData.bridegrooms_name || "Document"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    try {
      let html2pdfModule;
      if (window.html2pdf) {
        html2pdfModule = window.html2pdf;
      } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        document.head.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
        html2pdfModule = window.html2pdf;
      }

      await html2pdfModule().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Engine Failure:", error);
      alert("An unexpected error occurred while compiling the PDF engine.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* TOP BAR (NOT PRINTED) */}
      <div className="no-print" style={styles.topBar}>
        <div style={styles.brand}>Document Generator System</div>

        <div style={styles.actions}>
          <button onClick={handlePrint} style={styles.printBtn}>
            🖨 Print Document
          </button>

          <button onClick={handleSubmit} style={styles.pdfBtn}>
            📄 Download PDF
          </button>
        </div>
      </div>

      {/* A4 PAGE CONTAINER */}
      <div className="print-page" style={styles.page}>
        {/* OFFICIAL OUTSIDE BORDER WRAPPER */}
        <div style={styles.officialBorder}>
          
          {/* WATERMARK ACCENT */}
          <div className="print-watermark" style={styles.watermark}>Paktranslation.com</div>

          {/* HEADER SECTION */}
          <div style={styles.header}>
            <div style={styles.metaRow}>
              <div style={styles.smallTextLeft}>
                <strong>TRUE TRANSLATION</strong><br />
                From Urdu to English
              </div>
              <div style={styles.smallTextRight}>
                <strong>FORM II-D</strong><br />
                (See Rule 8 & 10)
              </div>
            </div>

            <h1 style={styles.title}>
              THE GOVERNMENT OF PUNJAB, PAKISTAN
            </h1>
            <h2 style={styles.subTitle}>
              MARRIAGE REGISTRATION CERTIFICATE
            </h2>
            <div style={styles.headerDivider}></div>
          </div>

          {/* FORM ELEMENT */}
          <form onSubmit={handleSubmit} style={styles.formContainer}>
            {formSchema.sections.map((section, i) => {
              // Check if this section belongs to the Groom or Bride
              const isGroomOrBride = 
                section.title.toLowerCase().includes("groom") || 
                section.title.toLowerCase().includes("bride");

              return (
                <div key={i} className="section" style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <span>{section.title}</span>
                  </h3>

                  {isGroomOrBride ? (
                    /* SMART HYBRID LAYOUT FOR GROOM/BRIDE TO ACCOMMODATE FULL-WIDTH ADDRESS */
                    <div style={styles.hybridFormWrapper}>
                      {/* Regular Fields Grid (Excluding Address, Tehsil, District) */}
                      <div className="grid-container" style={styles.grid}>
                        {section.fields
                          .filter(f => !f.label.toLowerCase().includes("address") && 
                                       !f.label.toLowerCase().includes("tehsil") && 
                                       !f.label.toLowerCase().includes("district"))
                          .map((field) => (
                            <div key={field.id} className="form-group" style={styles.formGroup}>
                              <label style={styles.label}>{field.label}:</label>
                              <input
                                type={field.type}
                                name={field.id}
                                onChange={handleChange}
                                style={styles.input}
                              />
                            </div>
                          ))}
                      </div>

                      {/* Full Width Address Line */}
                      {section.fields
                        .filter(f => f.label.toLowerCase().includes("address"))
                        .map((field) => (
                          <div key={field.id} className="form-group" style={styles.fullWidthGroup}>
                            <label style={styles.label}>{field.label}:</label>
                            <input
                              type={field.type}
                              name={field.id}
                              onChange={handleChange}
                              style={styles.input}
                            />
                          </div>
                        ))}

                      {/* Side-by-Side Tehsil & District Line */}
                      <div className="grid-container" style={styles.grid}>
                        {section.fields
                          .filter(f => f.label.toLowerCase().includes("tehsil") || 
                                       f.label.toLowerCase().includes("district"))
                          .map((field) => (
                            <div key={field.id} className="form-group" style={styles.formGroup}>
                              <label style={styles.label}>{field.label}:</label>
                              <input
                                type={field.type}
                                name={field.id}
                                onChange={handleChange}
                                style={styles.input}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    /* STANDARD 2-COLUMN GRID FOR OTHER SECTIONS */
                    <div className="grid-container" style={styles.grid}>
                      {section.fields.map((field) => (
                        <div key={field.id} className="form-group" style={styles.formGroup}>
                          <label style={styles.label}>{field.label}:</label>
                          <input
                            type={field.type}
                            name={field.id}
                            onChange={handleChange}
                            style={styles.input}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </form>

        </div>
      </div>

      {/* PRINT STYLESHEET REBALANCED FOR VERTICAL EXPANSION */}
      <style>{`
        * {
          box-sizing: border-box !important;
        }

        @media print {
          html, body {
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: hidden !important;
          }

          .no-print {
            display: none !important;
          }

          .print-page {
            box-shadow: none !important;
            margin: 0 auto !important;
            padding: 8mm !important; 
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
          }

          form {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            flex-grow: 1 !important;
            height: 100% !important;
          }

          .section {
            margin-bottom: 0 !important; 
            padding-bottom: 6px !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .grid-container {
            gap: 14px 24px !important; 
          }

          .form-group label {
            font-size: 11.5px !important;
          }

          .form-group input {
            padding: 3px 4px !important;
            font-size: 11.5px !important;
            border-bottom: 1px dashed #444 !important;
            background: transparent !important;
          }

          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
        }
      `}</style>
    </>
  );
}

/* ================= EXPANSIBLY BALANCED LAYOUT STYLES ================= */

const styles = {
  topBar: {
    background: "#0b2e4a",
    color: "white",
    padding: "14px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },

  brand: {
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.5px"
  },

  actions: {
    display: "flex",
    gap: "12px"
  },

  printBtn: {
    background: "#ffffff",
    color: "#0b2e4a",
    border: "1px solid #0b2e4a",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer"
  },

  pdfBtn: {
    background: "#28a745",
    color: "white",
    border: "none",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer"
  },

  page: {
    background: "#ffffff",
    color: "#111111",
    width: "210mm",
    height: "297mm",
    maxHeight: "297mm",
    margin: "30px auto",
    padding: "10mm 12mm", 
    fontFamily: "'Times New Roman', Times, serif",
    position: "relative",
    boxSizing: "border-box",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },

  officialBorder: {
    border: "3px double #0b2e4a",
    height: "100%",
    width: "100%",
    padding: "24px 24px 16px 24px", 
    boxSizing: "border-box",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flexGrow: 1
  },

  watermark: {
    position: "absolute",
    top: "54%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-30deg)",
    fontSize: "52px",
    fontWeight: "bold",
    color: "rgba(11, 46, 74, 0.03)",
    width: "100%",
    textAlign: "center",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    letterSpacing: "6px",
    zIndex: 0
  },

  header: {
    textAlign: "center",
    marginBottom: "24px",
    position: "relative",
    zIndex: 1
  },

  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: "12px"
  },

  smallTextLeft: {
    fontSize: "10.5px",
    textAlign: "left",
    lineHeight: "1.4",
    color: "#333"
  },

  smallTextRight: {
    fontSize: "10.5px",
    textAlign: "right",
    lineHeight: "1.4",
    color: "#333"
  },

  title: {
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    margin: "0 0 4px 0",
    color: "#0b2e4a"
  },

  subTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    margin: "0 0 12px 0",
    color: "#111"
  },

  headerDivider: {
    borderBottom: "1px solid #0b2e4a",
    width: "85%",
    margin: "0 auto"
  },

  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", 
    flexGrow: 1,
    height: "100%"
  },

  section: {
    marginBottom: "0px", 
    paddingBottom: "10px",
    position: "relative",
    zIndex: 1
  },

  sectionTitle: {
    fontSize: "11.5px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "14px",
    color: "#0b2e4a",
    borderBottom: "1px solid #0b2e4a",
    paddingBottom: "3px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 28px" 
  },

  hybridFormWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "14px" /* Matches row gaps perfectly */
  },

  formGroup: {
    display: "flex",
    alignItems: "flex-end"
  },

  fullWidthGroup: {
    display: "flex",
    alignItems: "flex-end",
    width: "100%"
  },

  label: {
    fontSize: "11.5px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    marginRight: "8px",
    color: "#222",
    lineHeight: "1.2"
  },

  input: {
    flex: 1,
    border: "none",
    borderBottom: "1px solid #777",
    padding: "3px 4px",
    fontSize: "11.5px",
    fontFamily: "'Times New Roman', Times, serif",
    background: "transparent",
    outline: "none"
  }
};