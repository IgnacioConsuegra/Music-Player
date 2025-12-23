import React, { useEffect, useState } from "react";

const PdfPage = () => {
  const [pdf, setPdf] = useState([]);
  const [currentPdf, setCurrentPdf] = useState(null);

  const loadPdf = async () => {
    try {
      const res = await fetch("/pdfList.json");
      const data = await res.json();
      console.log("HI", data);
      setPdf(data);
      setCurrentPdf(data[0] || null);
    } catch (error) {
      console.error("Error loading pdf:", error);
    }
  };

  useEffect(() => {
    loadPdf();
  }, []);

  useEffect(() => {}, [pdf, currentPdf]);

  return (
    <section className="text-white p-5 w-full md:p-5 min-h-screen md:h-full ">
      <div className="md:pb-5 w-full flex flex-wrap justify-center">
        {currentPdf ? (
          <>
            <h1 className="text-center text-2xl md:pb-2 w-full">
              {currentPdf.title}
            </h1>

            <div>
              <iframe
                src={currentPdf.url}
                title={currentPdf.title}
                className="h-150 w-full"
              />
            </div>
          </>
        ) : (
          <p>No PDF selected</p>
        )}
      </div>

      <div>
        <h3 className="text-white">List of pdf</h3>

        {pdf.map((pdf, index) => (
          <div
            key={index}
            onClick={() => setCurrentPdf(pdf)}
            className="flex gap-2 p-2 cursor-pointer border border-[#444] mb-4"
          >
            <div className="w-[120px] h-[70px] bg-[#222] flex items-center justify-center text-[#777] text-xs">
              PDF
            </div>

            <div>
              <p className="m-0">{pdf.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PdfPage;
