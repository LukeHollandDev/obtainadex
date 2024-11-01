import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { PDFPokemon } from "../types.ts";

export default async function generatePdf(
  filename: string,
  data: PDFPokemon[],
) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 20;
  const padding = 4;
  const boxSize = 10;
  let column = 1;

  // Helper function to draw checkboxes
  const drawCheckbox = (x: number, y: number, isChecked: boolean) => {
    page.drawSquare({
      x,
      y,
      size: boxSize,
      color: rgb(1, 1, 1),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    if (isChecked) {
      page.drawSquare({
        x: x + boxSize / 4,
        y: y + boxSize / 4,
        size: boxSize / 2,
        borderWidth: 1,
      });
    }
  };

  // Loop through all Pokemon and write to the PDF
  for (let i = 0, counter = 1; i < data.length; i++, counter++) {
    const name = data[i].name
      .replace("\u2640", " (F)")
      .replace("\u2642", " (M)");

    const colWidth = column === 1
      ? margin
      : column === 2
      ? margin + (width - margin * 2) / 3
      : margin + (2 * (width - margin * 2)) / 3;

    // Draw checkboxes
    const yPosition = height - (margin + counter * (fontSize + padding)) - 1;
    drawCheckbox(
      colWidth,
      yPosition,
      data[i].status === 1 || data[i].status === 2,
    ); // Obtained checkbox
    drawCheckbox(boxSize + padding + colWidth, yPosition, data[i].status === 2); // Own trainer ID checkbox

    // Add Pokemon name with ellipsis if too long
    page.drawText(name.length > 25 ? `${name.substring(0, 25)}...` : name, {
      x: 2 * (boxSize + padding) + colWidth,
      y: height - (margin + counter * (fontSize + padding)),
      size: fontSize,
      font: timesRomanFont,
    });

    // Check if the page height is exceeded
    if (height - (margin + (counter + 1) * (fontSize + padding)) <= margin) {
      counter = 0;
      column = column === 3 ? 1 : column + 1;
      page = column === 1 ? pdfDoc.addPage() : page; // Add a new page if needed
    }
  }

  // Download the PDF
  const pdfBytes = await pdfDoc.save();
  const url = URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `obtainadex-${filename}.pdf`;
  document.body.appendChild(a); // Append to body to work in Firefox
  a.click();
  a.remove();
}
