document.addEventListener("DOMContentLoaded",()=>{const s=document.getElementById("btnNuevaTecnologia"),r=document.getElementById("technologyFormContainer"),n=document.getElementById("technologyForm"),a=document.getElementById("technologiesTable");if(!s||!r||!n||!a){console.error("No se encontraron los elementos de tecnologías.");return}const c="/api/technologies";s.addEventListener("click",()=>{if(r.style.display==="none"||r.style.display===""){r.style.display="block",n.reset(),n.setAttribute("action",c),n.setAttribute("method","POST");const t=r.querySelector("h2");t&&(t.textContent="Nueva tecnología");const o=n.querySelector(".form-button");o&&(o.textContent="Guardar"),s.textContent="− Cerrar formulario"}else r.style.display="none",s.textContent="+ Nueva tecnología"});async function i(){a.innerHTML=`

            <tr>

                <td colspan="4">
                    Cargando...
                </td>

            </tr>

        `;try{const e=await fetch(c,{method:"GET",headers:{Accept:"application/json"}}),t=await e.json();if(!e.ok)throw new Error(t.message||`HTTP ${e.status}`);const o=Array.isArray(t)?t:t.data??[];b(o)}catch(e){console.error("Error cargando tecnologías:",e),a.innerHTML=`

                <tr>

                    <td colspan="4">

                        Error cargando tecnologías.

                        <br>

                        ${d(e.message)}

                    </td>

                </tr>

            `}}function b(e){if(a.innerHTML="",!e||e.length===0){a.innerHTML=`

                <tr>

                    <td colspan="4">

                        No hay tecnologías.

                    </td>

                </tr>

            `;return}e.forEach(t=>{const o=document.createElement("tr");o.innerHTML=`

                    <td>
                        ${t.id}
                    </td>

                    <td>
                        ${d(t.name??"")}
                    </td>

                    <td>
                        ${d(t.description??"")}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn-edit"
                            data-id="${t.id}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-delete"
                            data-id="${t.id}"
                        >
                            Eliminar
                        </button>

                    </td>

                `,a.appendChild(o)})}a.addEventListener("click",async e=>{const t=e.target.closest(".btn-edit");if(!t)return;const o=t.dataset.id;await p(o)});async function p(e){try{const t=await fetch(`${c}/${e}`,{method:"GET",headers:{Accept:"application/json"}}),o=await t.json();if(!t.ok)throw new Error(o.message||"No se pudo obtener la tecnología.");const l=o.data??o;r.style.display="block",s.textContent="− Cerrar formulario",n.setAttribute("action",`${c}/${e}`),n.setAttribute("method","PUT");const u=n.querySelector('[name="name"]'),m=n.querySelector('[name="description"]');u&&(u.value=l.name??""),m&&(m.value=l.description??"");const f=r.querySelector("h2");f&&(f.textContent="Editar tecnología");const y=n.querySelector(".form-button");y&&(y.textContent="Actualizar")}catch(t){console.error("Error obteniendo tecnología:",t),alert(t.message)}}a.addEventListener("click",async e=>{const t=e.target.closest(".btn-delete");if(!t)return;const o=t.dataset.id;confirm("¿Seguro que deseas eliminar esta tecnología?")&&await g(o)});async function g(e){try{const t=await fetch(`${c}/${e}`,{method:"DELETE",headers:{Accept:"application/json"}}),o=await t.json();if(!t.ok)throw new Error(o.message||"No se pudo eliminar.");console.log("Eliminado:",o),await i()}catch(t){console.error("Error eliminando:",t),alert(t.message)}}n.addEventListener("form:success",async()=>{await i(),n.reset(),n.setAttribute("action",c),n.setAttribute("method","POST");const e=r.querySelector("h2");e&&(e.textContent="Nueva tecnología");const t=n.querySelector(".form-button");t&&(t.textContent="Guardar")});function d(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}i()});
