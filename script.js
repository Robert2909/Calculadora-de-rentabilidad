(function () {
    const $ = (q, ctx = document) => ctx.querySelector(q);
    const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));
    const fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });

    let modoActual = 'normal'; // 'normal' o 'inverse'

    function getNumber(id) { return parseFloat($(id).value) || 0; }

    function setClasses(lineId, valueId, tone) {
        const line = document.getElementById(lineId);
        const val = document.getElementById(valueId);
        if (!line || !val) return;
        line.classList.remove('is-pos', 'is-neg', 'is-warn');
        val.classList.remove('tone-pos', 'tone-neg', 'tone-warn');
        if (tone === 'pos') { line.classList.add('is-pos'); val.classList.add('tone-pos'); }
        else if (tone === 'neg') { line.classList.add('is-neg'); val.classList.add('tone-neg'); }
        else if (tone === 'warn') { line.classList.add('is-warn'); val.classList.add('tone-warn'); }
    }

    function calcular() {
        try {
            const nombre = $('#nombre').value.trim();
            const proveedor = getNumber('#proveedor');
            const tiktok_pct = getNumber('#tiktok');
            const afiliado_pct = getNumber('#afiliado');
            const envio = getNumber('#envio');
            const embalaje = getNumber('#embalaje');
            const incluirAlm = $('#incluirAlmacenaje').checked;
            const almInput = $('#almacenaje');
            almInput.classList.toggle('disabled', !incluirAlm);
            almInput.disabled = !incluirAlm;
            const almacenaje = incluirAlm ? getNumber('#almacenaje') : 0;

            const costos_fijos = proveedor + envio + embalaje + almacenaje;
            const comisiones_pct = (tiktok_pct + afiliado_pct) / 100;

            let precio, ganancia, margen, roi;

            if (modoActual === 'normal') {
                precio = getNumber('#precio');
                const com_tiktok = precio * (tiktok_pct / 100);
                const com_afiliado = precio * (afiliado_pct / 100);
                const total_gastos = costos_fijos + com_tiktok + com_afiliado;
                ganancia = precio - total_gastos;
                margen = precio ? (ganancia / precio) * 100 : 0;
            } else {
                const margen_deseado_pct = getNumber('#margenDeseado') / 100;
                // Formula: Price = Fixed_Costs / (1 - Comisions% - Margin%)
                const divisor = (1 - comisiones_pct - margen_deseado_pct);
                if (divisor > 0) {
                    precio = costos_fijos / divisor;
                } else {
                    precio = 0;
                }
                ganancia = precio * margen_deseado_pct;
                margen = margen_deseado_pct * 100;
                // Actualizar el campo de precio (opcional, pero ayuda al usuario)
                $('#precio').value = precio.toFixed(2);
            }

            const total_gastos = precio - ganancia;
            const com_tiktok = precio * (tiktok_pct / 100);
            const com_afiliado = precio * (afiliado_pct / 100);
            const costo_inversion = costos_fijos;
            roi = costo_inversion ? (ganancia / costo_inversion) * 100 : 0;
            const equilibrio = precio ? (total_gastos / precio) : 0;

            // Mostrar panel resultados
            const panel = $('#resultado');
            panel.style.display = 'block';
            $('#tituloProductoVisual').textContent = nombre || 'Producto';

            // Resumen
            $('#gananciaNetaResumen').textContent = fmt.format(ganancia);
            $('#margenResumen').textContent = `${margen.toFixed(2)}%`;
            const fillWidthGanancia = Math.max(0, Math.min(100, (ganancia / Math.max(1, precio)) * 100));
            $('#barraGanancia').style.width = `${fillWidthGanancia}%`;
            $('#barraMargen').style.width = `${Math.max(0, Math.min(100, margen))}%`;

            // Desglose
            $('#precioVenta').textContent = `+${fmt.format(precio)}`;
            $('#costoProveedor').textContent = `-${fmt.format(proveedor)}`;
            $('#comisionTikTok').textContent = `-${fmt.format(com_tiktok)}`;
            $('#comisionAfiliado').textContent = `-${fmt.format(com_afiliado)}`;
            $('#costoEnvio').textContent = `-${fmt.format(envio)}`;
            $('#costoEmbalaje').textContent = `-${fmt.format(embalaje)}`;
            $('#costoAlmacenaje').textContent = `-${fmt.format(almacenaje)}`;
            $('#totalGastos').textContent = `-${fmt.format(total_gastos)}`;

            setClasses('linePrecio', 'precioVenta', 'pos');
            setClasses('lineProveedor', 'costoProveedor', 'neg');
            setClasses('lineTikTok', 'comisionTikTok', 'neg');
            setClasses('lineAfiliado', 'comisionAfiliado', 'neg');
            setClasses('lineEnvio', 'costoEnvio', 'neg');
            setClasses('lineEmbalaje', 'costoEmbalaje', 'neg');
            setClasses('lineAlmacenaje', 'costoAlmacenaje', almacenaje > 0 ? 'neg' : 'warn');
            setClasses('lineTotal', 'totalGastos', 'warn');

            // Métricas
            $('#roi').textContent = `${roi.toFixed(2)}%`;
            $('#equilibrio').textContent = `${equilibrio.toFixed(2)} uds`;
            $('#gananciaUnidad').textContent = fmt.format(ganancia);

            // Proyecciones mensuales
            const volumen = getNumber('#volumen');
            const ingresos_mensuales = precio * volumen;
            const ganancia_mensual = ganancia * volumen;
            const inversion_mensual = costos_fijos * volumen;

            $('#ingresosMensuales').textContent = fmt.format(ingresos_mensuales);
            $('#gananciaMensual').textContent = fmt.format(ganancia_mensual);
            $('#inversionMensual').textContent = fmt.format(inversion_mensual);

            // Conclusión
            let conclusion = 'Margen insuficiente.'; let state = 'state-bad';
            if (margen > 25) { conclusion = 'Buen margen.'; state = 'state-good'; }
            else if (margen >= 15) { conclusion = 'Margen regular.'; state = 'state-warn'; }
            const t = $('#textoConclusion');
            t.classList.remove('state-good', 'state-warn', 'state-bad');
            t.classList.add(state);
            t.textContent = conclusion;
        } catch (err) {
            console.error(err);
        }
    }

    // Switch modo
    $('#modeNormal').addEventListener('click', () => {
        modoActual = 'normal';
        $('#modeNormal').classList.add('active');
        $('#modeInverse').classList.remove('active');
        $('#containerPrecio').style.display = 'block';
        $('#containerMargenDeseado').style.display = 'none';
        calcular();
    });

    $('#modeInverse').addEventListener('click', () => {
        modoActual = 'inverse';
        $('#modeInverse').classList.add('active');
        $('#modeNormal').classList.remove('active');
        $('#containerPrecio').style.display = 'none';
        $('#containerMargenDeseado').style.display = 'block';
        calcular();
    });

    // Bind inputs
    $$('input').forEach(i => {
        i.addEventListener('input', calcular);
        i.addEventListener('change', calcular);
    });

    // Initial calc
    calcular();

    // Export
    $('#btnExportar').addEventListener('click', () => {
        const resultado = document.getElementById('resultado');
        const nombre = ($('#nombre').value || 'Producto').trim().replace(/\s+/g, '_');
        const fecha = new Date().toISOString().slice(0, 10);
        html2canvas(resultado, { backgroundColor: null, useCORS: true, scale: 2 }).then(canvas => {
            const a = document.createElement('a');
            a.download = `Rentabilidad_${nombre}_${fecha}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        }).catch(err => alert('Error al exportar: ' + err.message));
    });
})();
