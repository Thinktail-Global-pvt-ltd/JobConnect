import Swal from 'sweetalert2';

export const showStatusAlert = (title, text = '', icon = 'success') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: '#153e69',
    cancelButtonColor: '#d33',
    customClass: {
      popup: 'rounded-3xl font-sans text-slate-800 shadow-2xl border border-slate-100',
      title: 'font-outfit font-extrabold text-xl text-slate-900',
      htmlContainer: 'text-xs font-semibold text-slate-600',
      confirmButton: 'rounded-xl font-bold px-6 py-2.5 text-xs shadow-xs',
      cancelButton: 'rounded-xl font-bold px-6 py-2.5 text-xs shadow-xs',
    },
    buttonsStyling: true,
    timer: icon === 'success' || icon === 'info' ? 2500 : undefined,
    timerProgressBar: icon === 'success' || icon === 'info',
  });
};

export const showConfirmAlert = (title, text, confirmButtonText = 'Yes, proceed!') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#153e69',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: confirmButtonText,
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'rounded-3xl font-sans text-slate-800 shadow-2xl border border-slate-100',
      title: 'font-outfit font-extrabold text-xl text-slate-900',
      htmlContainer: 'text-xs font-semibold text-slate-600',
      confirmButton: 'rounded-xl font-bold px-5 py-2.5 text-xs shadow-xs',
      cancelButton: 'rounded-xl font-bold px-5 py-2.5 text-xs shadow-xs',
    }
  });
};

export default Swal;
