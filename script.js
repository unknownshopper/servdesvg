// Datos de los servicios
const SERVICES = {
  'mystery-shopping': {
    title: 'Mystery Shopping',
    body:
      'Evaluamos la experiencia real de tus clientes mediante visitas encubiertas y auditorías discretas para detectar oportunidades de mejora.',
    bullets: [
      'Diseño de escenarios y KPIs a medida',
      'Visitas presenciales y remotas',
      'Reportes con evidencias y recomendaciones accionables',
      'Benchmark por sucursal y por competidor',
    ],
  },
  'estudios-mercado': {
    title: 'Estudios de Mercado',
    body:
      'Tomamos decisiones con datos: investigación cuantitativa y cualitativa para entender al cliente y al mercado.',
    bullets: [
      'Encuestas online y presenciales',
      'Entrevistas en profundidad y focus groups',
      'Análisis de segmentación y pricing',
      'Dashboards y storytelling de insights',
    ],
  },
  'sitios-web': {
    title: 'Sitios Web',
    body:
      'Diseño y desarrollo de sitios modernos, rápidos y orientados a conversión, con buenas prácticas de SEO técnico.',
    bullets: [
      'Landing pages y sitios corporativos',
      'Web Performance (Core Web Vitals)',
      'CMS (WordPress/Headless) según necesidad',
      'Optimización SEO on-page y analítica',
    ],
  },
  'integraciones-crm': {
    title: 'Integraciones CRM',
    body:
      'Conectamos tus herramientas para centralizar datos, automatizar procesos y acelerar ventas.',
    bullets: [
      'Integración con HubSpot, Salesforce, Zoho, etc.',
      'Automatizaciones y flujos de nurturing',
      'Sincronización de leads y métricas clave',
      'Capacitación y buenas prácticas de adopción',
    ],
  },
  'social-media': {
    title: 'Social Media',
    body:
      'Estrategia, calendario, producción y gestión de comunidad para crecer con marca y performance.',
    bullets: [
      'Estrategia y lineamientos de marca',
      'Calendario editorial y producción de contenidos',
      'Gestión de comunidad (inbound/respuestas)',
      'Paid Social y optimización de campañas',
    ],
  },
};

// Elementos del modal (puede no existir en páginas de detalle)
const modal = document.getElementById('serviceModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalBullets = document.getElementById('modalBullets');

let lastFocused = null;

function openModal(serviceKey) {
  if (!modal) return;
  const data = SERVICES[serviceKey];
  if (!data) return;

  // Completar contenido
  modalTitle.textContent = data.title;
  modalBody.textContent = data.body;
  modalBullets.innerHTML = '';
  data.bullets.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    modalBullets.appendChild(li);
  });

  // Mostrar modal y bloquear scroll
  lastFocused = document.activeElement;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Enfocar botón de cierre
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }
  
  // Utilidades de animación para el árbol de concentrado
  function collapseBranch(li, toggleBtn) {
    const ul = li.querySelector(':scope > ul');
    if (!ul) return;
    // Si ya está colapsado, nada
    if (li.classList.contains('collapsed')) return;
    // Altura actual
    const start = ul.scrollHeight;
    ul.classList.add('is-animating');
    ul.style.height = start + 'px';
    ul.style.opacity = '1';
    // Forzar reflow
    ul.getBoundingClientRect();
    // Animar a 0
    ul.style.height = '0px';
    ul.style.opacity = '0';
    const onEnd = () => {
      ul.removeEventListener('transitionend', onEnd);
      ul.classList.remove('is-animating');
      ul.style.height = '';
      ul.style.opacity = '';
      li.classList.add('collapsed');
      if (toggleBtn) {
        toggleBtn.textContent = '+';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    };
    ul.addEventListener('transitionend', onEnd);
  }

  function expandBranch(li, toggleBtn) {
    const ul = li.querySelector(':scope > ul');
    if (!ul) return;
    // Si ya está expandido, nada
    if (!li.classList.contains('collapsed')) return;
    // Primero hacer visible quitando el estado colapsado
    li.classList.remove('collapsed');
    const target = ul.scrollHeight; // altura destino
    ul.classList.add('is-animating');
    ul.style.height = '0px';
    ul.style.opacity = '0';
    // Forzar reflow
    ul.getBoundingClientRect();
    // Animar hasta la altura destino
    ul.style.height = target + 'px';
    ul.style.opacity = '1';
    const onEnd = () => {
      ul.removeEventListener('transitionend', onEnd);
      ul.classList.remove('is-animating');
      ul.style.height = '';
      ul.style.opacity = '';
      if (toggleBtn) {
        toggleBtn.textContent = '−';
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    };
    ul.addEventListener('transitionend', onEnd);
  }

  function toggleBranch(li, forceExpand = null) {
    const btn = li.querySelector(':scope > .row > .toggle');
    const shouldExpand = forceExpand !== null ? forceExpand : li.classList.contains('collapsed');
    if (shouldExpand) expandBranch(li, btn); else collapseBranch(li, btn);
  }

  // Delegación de eventos para botones "Ver detalle"
  document.addEventListener('click', (e) => {
    // Abrir/cerrar menú hamburguesa
    const navToggle = e.target.closest('.nav-toggle');
    if (navToggle) {
      const header = navToggle.closest('.site-header');
      const nav = header ? header.querySelector('.main-nav') : null;
      if (nav) {
        const isOpen = nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      }
    }

    const btn = e.target.closest('.ver-detalle');
    if (btn) {
      const card = btn.closest('.card');
      if (!card) return;
      const key = card.getAttribute('data-service');
      openModal(key);
    }

    // Cerrar por elementos con data-close (backdrop y botón X)
    if (e.target.matches('[data-close]')) {
      closeModal();
    }

    // Toggle del árbol en concentrado.html
    const toggle = e.target.closest('.toggle');
    if (toggle) {
      const li = toggle.closest('li');
      if (!li) return;
      toggleBranch(li);
    }
  });

  // Controles globales del árbol (si existen en la página actual)
  function setTreeAll(expanded) {
    document.querySelectorAll('.tree li.has-children').forEach((li) => {
      toggleBranch(li, expanded);
    });
  }

  const expandAllBtn = document.getElementById('expandAll');
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => setTreeAll(true));
  }
  const collapseAllBtn = document.getElementById('collapseAll');
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => setTreeAll(false));
  }

  // Descargar PDF del concentrado: expandir todo y luego imprimir
  const downloadPdfBtn = document.getElementById('downloadPdf');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      setTreeAll(true);
      // Esperar a que terminen animaciones antes de imprimir
      setTimeout(() => {
        window.print();
      }, 350);
    });
  }

  // Colapsar por defecto todas las ramas del árbol
  (function initTreeCollapsed() {
    const treeNodes = document.querySelectorAll('.tree li.has-children');
    if (!treeNodes.length) return;
    treeNodes.forEach((li) => {
      li.classList.add('collapsed');
      const btn = li.querySelector(':scope > .row > .toggle');
      if (btn) {
        btn.textContent = '+';
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
  
  // No bloqueamos la propagación dentro del contenido para que la X funcione correctamente.



  // --- Selección de servicios con checkboxes ---
(function initSelectionPage(){
    const root = document.getElementById('selectionRoot');
    if (!root) return;
  
    const list = document.getElementById('selectionList');
    const parentChecks = Array.from(root.querySelectorAll('.chk-parent'));
    const itemChecks = Array.from(root.querySelectorAll('.chk-item'));
    const mapByCat = {};
    itemChecks.forEach(ch => {
      const cat = ch.dataset.cat;
      mapByCat[cat] = mapByCat[cat] || [];
      mapByCat[cat].push(ch);
    });
  
    // Marcar/desmarcar hijos cuando cambia el padre
    parentChecks.forEach(parent => {
      parent.addEventListener('change', () => {
        const cat = parent.dataset.cat;
        (mapByCat[cat] || []).forEach(ch => { ch.checked = parent.checked; });
        updateParentsIndeterminate();
        renderSelection();
      });
    });
  
    // Actualizar estado indeterminado del padre según hijos
    function updateParentsIndeterminate() {
      parentChecks.forEach(parent => {
        const cat = parent.dataset.cat;
        const items = mapByCat[cat] || [];
        const total = items.length;
        const checked = items.filter(i => i.checked).length;
        parent.indeterminate = checked > 0 && checked < total;
        parent.checked = checked === total && total > 0;
      });
    }
  
    // Render del resumen
    function renderSelection() {
      const chosen = [];
      Object.keys(mapByCat).forEach(cat => {
        const nameMap = {
          mystery: 'Mystery Shopping',
          estudios: 'Estudios de Mercado',
          sitios: 'Sitios Web',
          crm: 'Integraciones CRM',
          social: 'Social Media'
        };
        const catName = nameMap[cat] || cat;
        const picked = (mapByCat[cat] || []).filter(ch => ch.checked).map(ch => ch.dataset.name);
        if (picked.length) {
          chosen.push({ cat: catName, items: picked });
        }
      });

      list.innerHTML = '';
      if (!chosen.length) {
        const li = document.createElement('li');
        li.className = 'muted';
        li.textContent = 'Sin selección por ahora.';
        list.appendChild(li);
        return;
      }
      chosen.forEach(block => {
        const li = document.createElement('li');
        const title = document.createElement('div');
        title.innerHTML = `<strong>${block.cat}</strong>`;
        const ul = document.createElement('ul');
        block.items.forEach(it => {
          const itLi = document.createElement('li');
          itLi.textContent = it;
          ul.appendChild(itLi);
        });
        li.appendChild(title);
        li.appendChild(ul);
        list.appendChild(li);
      });
    }

    // Botones de acciones
    const copyBtn = document.getElementById('copySelection');
    const dlBtnPdf = document.getElementById('downloadSelectionPdf');
    const clearBtn = document.getElementById('clearSelection');

    function buildText() {
      let text = 'Selección de servicios - The Unknown Shopper\n\n';
      Object.keys(mapByCat).forEach(cat => {
        const items = (mapByCat[cat] || []).filter(ch => ch.checked).map(ch => `- ${ch.dataset.name}`);
        if (items.length) {
          const nameMap = { mystery:'Mystery Shopping', estudios:'Estudios de Mercado', sitios:'Sitios Web', crm:'Integraciones CRM', social:'Social Media' };
          text += `${nameMap[cat] || cat}:\n${items.join('\n')}\n\n`;
        }
      });
      return text.trim() + '\n';
    }
  
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(buildText());
          copyBtn.textContent = 'Copiado ✓';
          setTimeout(() => (copyBtn.textContent = 'Copiar'), 1200);
        } catch (err) {
          // Fallback silencioso
          console.warn('No se pudo copiar al portapapeles', err);
        }
      });
    }

    // Descargar PDF con formato institucional
    if (dlBtnPdf) {
      dlBtnPdf.addEventListener('click', () => {
        const printRoot = document.getElementById('printSelection');
        const printList = document.getElementById('printSelectionList');
        const printDate = document.getElementById('printDate');
        if (!printRoot || !printList) return;

        // Fecha legible
        const now = new Date();
        const formatted = now.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });
        if (printDate) printDate.textContent = `Fecha: ${formatted}`;

        // Construir HTML por categorías
        const nameMap = { mystery:'Mystery Shopping', estudios:'Estudios de Mercado', sitios:'Sitios Web', crm:'Integraciones CRM', social:'Social Media' };
        let html = '';
        Object.keys(mapByCat).forEach(cat => {
          const items = (mapByCat[cat] || []).filter(ch => ch.checked).map(ch => ch.dataset.name);
          if (!items.length) return;
          html += `<h2 style="margin:.75rem 0 .25rem 0; font-size:1.05rem;">${nameMap[cat] || cat}</h2>`;
          html += '<ul style="margin:.25rem 0 .5rem 1rem;">';
          items.forEach(it => { html += `<li>${it}</li>`; });
          html += '</ul>';
        });
        if (!html) html = '<p style="color:#666;">No hay elementos seleccionados.</p>';
        printList.innerHTML = html;

        // Lanzar diálogo de impresión
        window.print();
      });
    }

    // Limpiar selección (padres e hijos)
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        itemChecks.forEach(ch => (ch.checked = false));
        parentChecks.forEach(p => { p.checked = false; p.indeterminate = false; });
        updateParentsIndeterminate();
        renderSelection();
      });
    }
  
    // Inicial
    updateParentsIndeterminate();
    renderSelection();
  })();