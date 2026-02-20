export function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}