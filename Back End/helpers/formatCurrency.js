function formatCurrency(number) {
    return `Rp. ${number.toLocaleString('id-ID')}`;
  }
  
  module.exports = formatCurrency;
  