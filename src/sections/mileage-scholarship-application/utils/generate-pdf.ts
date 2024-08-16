import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const PDF_MARGIN = 10;

async function generatePDF(id: string, name: string) {
  const dialogElement = document.getElementById(id);

  if (!dialogElement) return;

  // 전체 내용을 캡쳐하기 위해 overflow, maxHeight, height를 조정
  const originalOverflow = dialogElement.style.overflow;
  const originalMaxHeight = dialogElement.style.maxHeight;
  const originalHeight = dialogElement.style.height;

  dialogElement.style.overflow = 'visible';
  dialogElement.style.maxHeight = 'none';
  dialogElement.style.height = 'auto';

  html2canvas(dialogElement)
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPdf('p', 'mm', 'a4');
      const imgWidth = A4_WIDTH - PDF_MARGIN * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = PDF_MARGIN;

      pdf.addImage(imgData, 'JPEG', PDF_MARGIN, position, imgWidth, imgHeight);
      heightLeft -= A4_HEIGHT;

      // 화면이 넘칠 경우 다음 페이지 추가
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + PDF_MARGIN;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', PDF_MARGIN, position, imgWidth, imgHeight);
        heightLeft -= A4_HEIGHT;
      }

      pdf.save(`${name}.pdf`);
    })
    .catch((error) => console.error(error))
    .finally(() => {
      // 원래대로 복구
      dialogElement.style.overflow = originalOverflow;
      dialogElement.style.maxHeight = originalMaxHeight;
      dialogElement.style.height = originalHeight;
    });
}

export default generatePDF;
