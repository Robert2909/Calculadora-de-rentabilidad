// Función principal de cálculo
function calcularGanancia() {
  try {
    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value) || 0;
    const proveedor = parseFloat(document.getElementById("proveedor").value) || 0;
    const tiktok_pct = parseFloat(document.getElementById("tiktok").value) || 0;
    const afiliado_pct = parseFloat(document.getElementById("afiliado").value) || 0;
    const envio = parseFloat(document.getElementById("envio").value) || 0;
    const embalaje = parseFloat(document.getElementById("embalaje").value) || 0;
    const incluirAlm = document.getElementById("incluirAlmacenaje").checked;

    const almacenajeInput = document.getElementById("almacenaje");
    almacenajeInput.disabled = !incluirAlm;
    almacenajeInput.classList.toggle("deshabilitado", !incluirAlm);

    const almacenaje = incluirAlm ? parseFloat(almacenajeInput.value || 0) : 0;

    const com_tiktok = precio * (tiktok_pct / 100);
    const com_afiliado = precio * (afiliado_pct / 100);
    const total_gastos = proveedor + com_tiktok + com_afiliado + envio + embalaje + almacenaje;
    const ganancia = precio - total_gastos;
    const margen = (ganancia / precio) * 100;
    const costo_inversion = proveedor + envio + embalaje + almacenaje;
    const roi = costo_inversion ? (ganancia / costo_inversion) * 100 : 0;
    const equilibrio = precio ? total_gastos / precio : 0;

    // Mostrar contenedor de resultados
    const resultadoHTML = document.getElementById("resultado");
    resultadoHTML.style.display = "block";

    document.getElementById("tituloProductoVisual").innerText = nombre;

    // Actualizar resumen superior
    const resumen = document.querySelector(".resultado-resumen");

    document.getElementById("gananciaNetaResumen").innerText = `$${ganancia.toFixed(2)}`;
    document.getElementById("margenResumen").innerText = `${margen.toFixed(2)}%`;
    document.getElementById("barraGanancia").style.width = `${Math.min(100, (ganancia / precio) * 100)}%`;
    document.getElementById("barraMargen").style.width = `${Math.min(100, margen)}%`;

    // Actualizar desglose
    document.getElementById("precioVenta").innerText = `+$${precio.toFixed(2)}`;
    document.getElementById("costoProveedor").innerText = `-$${proveedor.toFixed(2)}`;
    document.getElementById("comisionTikTok").innerText = `-$${com_tiktok.toFixed(2)}`;
    document.getElementById("comisionAfiliado").innerText = `-$${com_afiliado.toFixed(2)}`;
    document.getElementById("costoEnvio").innerText = `-$${envio.toFixed(2)}`;
    document.getElementById("costoEmbalaje").innerText = `-$${embalaje.toFixed(2)}`;
    document.getElementById("costoAlmacenaje").innerText = `-$${almacenaje.toFixed(2)}`;
    document.getElementById("totalGastos").innerText = `-$${total_gastos.toFixed(2)}`;

    // Actualizar métricas
    document.getElementById("roi").innerText = `${roi.toFixed(2)}%`;
    document.getElementById("equilibrio").innerText = `${equilibrio.toFixed(2)} unidades`;
    document.getElementById("gananciaUnidad").innerText = `$${ganancia.toFixed(2)}`;

    // Conclusión
    let conclusionTexto = "";
    if (margen > 25) {
      conclusionTexto = "✅ Buen margen.";
    } else if (margen >= 15) {
      conclusionTexto = "⚠️ Margen regular.";
    } else {
      conclusionTexto = "❌ Mal margen.";
    }

    document.getElementById("textoConclusion").innerText = conclusionTexto;

  } catch (err) {
    alert("Error en los datos ingresados. Verifica los campos numéricos.\n" + err.message);
  }
}

// Escuchar cualquier cambio en inputs o checkbox
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", calcularGanancia);
  input.addEventListener("change", calcularGanancia);
});

// Ejecutar una vez al cargar
calcularGanancia();

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnExportar").addEventListener("click", function () {
    const resultado = document.getElementById("resultado");
    const nombreProducto = document.getElementById("nombre").value.trim().replace(/\s+/g, "_");
    const fecha = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    html2canvas(resultado, {
      backgroundColor: null,
      useCORS: true,
      scale: 2
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = `Rentabilidad_${nombreProducto}_${fecha}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).catch(err => {
      alert("Ocurrió un error al exportar la imagen. Intenta nuevamente.\n" + err.message);
    });
  });
});
