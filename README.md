# 🌿 Psicología Web — Guía de configuración

Proyecto web completo para consulta de psicología.  
Listo para VS Code, hosting estático y dominio propio.

---

## 📁 Estructura del proyecto

```
psicologia-web/
├── index.html                  ← Página principal
├── politica-privacidad.html
├── aviso-legal.html
├── cookies.html
├── css/
│   ├── style.css               ← Estilos principales
│   └── legal.css               ← Estilos páginas legales
├── js/
│   └── main.js                 ← JavaScript
└── assets/
    ├── favicon.svg
    ├── audio/
    │   ├── episodio-01.mp3     ← Sube aquí tus audios
    │   ├── episodio-02.mp3
    │   └── episodio-03.mp3
    ├── images/
    │   └── foto-perfil.jpg     ← Tu foto de perfil
    └── pdf/
        ├── diario-emociones.pdf
        ├── respiracion.pdf
        └── autocuidado.pdf
```

---

## ✏️ Personalización — Lista de cambios necesarios

Busca y reemplaza en todos los archivos:

| Placeholder              | Reemplaza por                        |
|--------------------------|--------------------------------------|
| `[Tu Nombre]`            | Tu nombre real                       |
| `[Tu Nombre completo]`   | Nombre completo para textos legales  |
| `hola@tu-dominio.com`    | Tu dirección de email                |
| `+34 600 000 000`        | Tu teléfono real                     |
| `https://www.tu-dominio.com` | Tu dominio real                  |
| `[Universidad]`          | Tu universidad                       |
| `[Número colegio]`       | Tu número de colegiación             |
| `[Ciudad]`               | Tu ciudad                            |
| `[Dirección consulta]`   | Dirección física (si procede)        |
| `[Fecha]`                | Fecha de última actualización legal  |
| `tu-usuario`             | Tus handles de redes sociales        |

---

## 🖼️ Foto de perfil

Añade tu foto en `assets/images/foto-perfil.jpg`.  
Luego descomenta en `index.html`:

```html
<!-- Sustituye por: -->
<img src="assets/images/foto-perfil.jpg" alt="[Tu nombre]" />
```
Y elimina el `<div class="photo-initials">[Foto]</div>`.

---

## 🎙️ Subir audios del podcast

Coloca los archivos MP3 en `assets/audio/`:
- `episodio-01.mp3`
- `episodio-02.mp3`
- `episodio-03.mp3`

Para añadir más episodios, duplica un bloque `<article class="podcast-card">` en `index.html` y actualiza los IDs (`audio4`, `progress4`, `time4`).

---

## 📩 Formulario de contacto — Activación real

El formulario actualmente simula el envío. Para hacerlo funcional:

### Opción A — Formspree (gratuito, sin backend)
1. Regístrate en [formspree.io](https://formspree.io)
2. Crea un formulario y copia tu `endpoint`
3. En `js/main.js`, sustituye la línea simulada:

```js
await new Promise(r => setTimeout(r, 1200));
```
por:
```js
const formData = new FormData(contactForm);
const res = await fetch('https://formspree.io/f/TU_ID', {
  method: 'POST',
  body: formData,
  headers: { 'Accept': 'application/json' }
});
if (!res.ok) throw new Error('Error al enviar');
```

### Opción B — EmailJS (sin servidor)
1. Regístrate en [emailjs.com](https://www.emailjs.com)
2. Añade su SDK en el `<head>` del HTML
3. Llama a `emailjs.send(...)` con tus credenciales

---

## 🌐 Publicar en hosting

### Cualquier hosting estático (Ionos, Hostinger, SiteGround…)
1. Comprime la carpeta `psicologia-web/` en un `.zip`
2. Sube los archivos al directorio raíz (normalmente `public_html/` o `www/`)
3. Apunta tu dominio al hosting

### Netlify / Vercel (hosting moderno, gratuito)
```bash
# Netlify
npm install -g netlify-cli
netlify deploy --dir=. --prod

# Vercel
npx vercel --prod
```

### GitHub Pages
1. Sube el proyecto a un repositorio GitHub
2. Ve a Settings → Pages → Source: `main` branch
3. Tu web estará en `https://tu-usuario.github.io/repo-name`

---

## 🔒 HTTPS y dominio propio
- Con Netlify/Vercel: HTTPS automático gratis (Let's Encrypt)
- Con hosting tradicional: activa el certificado SSL desde el panel de control

---

## 📊 Analytics (opcional)
Para añadir Google Analytics 4, añade antes de `</head>` en todos los HTML:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🛠️ VS Code — Extensiones recomendadas
- **Live Server** — previsualizar en tiempo real
- **Prettier** — formateo de código
- **HTMLHint** — validación HTML

Para abrir el proyecto:
```
File → Open Folder → selecciona la carpeta psicologia-web
```
Luego clic derecho sobre `index.html` → "Open with Live Server"

---

## ✅ Checklist antes de publicar

- [ ] Sustituir todos los `[placeholders]`
- [ ] Añadir foto de perfil real
- [ ] Subir audios MP3
- [ ] Subir PDFs descargables
- [ ] Activar formulario de contacto real
- [ ] Añadir número de colegiación real en el footer
- [ ] Revisar y completar textos legales con un abogado/asesor
- [ ] Activar Analytics
- [ ] Verificar HTTPS activo en el dominio
- [ ] Probar en móvil y tablet

---

Cualquier duda, personaliza con calma — el código está comentado. ✦
