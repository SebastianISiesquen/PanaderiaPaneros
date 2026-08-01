/* =========================================================
   PANADERÍA PANEROS - Script principal
   ========================================================= */

/* ---------- Toasts ---------- */
function mostrarToast(titulo, mensaje, icono) {
    const contenedor = document.getElementById('toast-container');
    if (!contenedor) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML =
        '<i class="fa-solid ' + (icono || 'fa-check-circle') + '"></i>' +
        '<span>' + titulo + ' ' + (mensaje || '') + '</span>';

    contenedor.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast--out');
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

/* ---------- Animación al hacer scroll ---------- */
function iniciarRevelaciones() {
    const elementos = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        elementos.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('is-visible');
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    elementos.forEach((el) => observador.observe(el));
}

/* ---------- Menú móvil ---------- */
function iniciarMenuMovil() {
    const boton = document.getElementById('menuToggle');
    const menu = document.getElementById('navbarMenu');
    if (!boton || !menu) return;

    boton.addEventListener('click', function () {
        const abierto = menu.classList.toggle('is-open');
        boton.classList.toggle('is-open', abierto);
    });

    menu.querySelectorAll('a').forEach((enlace) => {
        enlace.addEventListener('click', function () {
            menu.classList.remove('is-open');
            boton.classList.remove('is-open');
        });
    });
}

/* ---------- Formulario de contacto ---------- */
function iniciarFormularioContacto() {
    const formulario = document.getElementById('contactForm');
    if (!formulario) return;

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        mostrarToast('Mensaje enviado', 'Gracias por escribirnos.', 'fa-paper-plane');
        formulario.reset();
    });
}

/* ---------- Chatbot (Landbot) ---------- */
function iniciarChatbot() {
    window.addEventListener('mouseover', initLandbot, { once: true });
    window.addEventListener('touchstart', initLandbot, { once: true });

    let myLandbot;
    function initLandbot() {
        if (!myLandbot) {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.addEventListener('load', function () {
                myLandbot = new Landbot.Livechat({
                    configUrl:
                        'https://storage.googleapis.com/landbot.online/v3/H-2713939-MXWHQKMQYP2TT8C3/index.json',
                });
            });
            s.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';
            const x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        }
    }
}

/* ---------- Año del pie de página ---------- */
function actualizarAnio() {
    const anio = document.getElementById('anio');
    if (anio) {
        anio.textContent = new Date().getFullYear();
    }
}

/* ---------- Carga de cabecera y pie ---------- */
function cargarPartes() {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const promesas = [];

    if (header) {
        promesas.push(
            $.get('partials/header.html', function (html) {
                header.innerHTML = html;
            })
        );
    }
    if (footer) {
        promesas.push(
            $.get('partials/footer.html', function (html) {
                footer.innerHTML = html;
            })
        );
    }

    $.when.apply($, promesas).done(function () {
        iniciarMenuMovil();
        iniciarFormularioContacto();
        iniciarRevelaciones();
        actualizarAnio();

        const pagina = window.activePage || 'index';
        document.querySelectorAll('.nav-link[data-page]').forEach(function (enlace) {
            if (enlace.getAttribute('data-page') === pagina) {
                enlace.classList.add('is-active');
            }
        });
    });
}

/* ---------- Arranque ---------- */
$(document).ready(function () {
    cargarPartes();
    iniciarChatbot();
});
