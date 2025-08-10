let excelData = [];

$('#excelFile').on('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  const fileName = file.name.toLowerCase();

  reader.onload = function(e) {
    let workbook;

    if (fileName.endsWith('.csv')) {
      const csvText = e.target.result;
      workbook = XLSX.read(csvText, { type: 'string' });
    } else {
      const data = new Uint8Array(e.target.result);
      workbook = XLSX.read(data, { type: 'array' });
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    $('#itemList').empty();
    excelData.forEach((row) => {
      if (row.length > 0) {
        $('#itemList').append(`<li class="item">${row.join(' | ')}</li>`);
      }
    });
  };

  if (fileName.endsWith('.csv')) {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file);
  }
});

$('#searchInput').on('keyup', function() {
  const value = $(this).val().toLowerCase();
  $('#itemList .item').each(function() {
    const text = $(this).text().toLowerCase();
    $(this).toggle(text.includes(value));
  });
});
