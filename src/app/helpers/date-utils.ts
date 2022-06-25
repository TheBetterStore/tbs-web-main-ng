export class DateUtils {
  static getLocalDateFromIso(s): string {
    function pad(n) {
      return n < 10 ? '0' + n : n;
    }
    const d = new Date(s);
    let result = null;
    if (d != null) {
      result = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    return result;
  }
}
