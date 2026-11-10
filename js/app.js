const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const BADGE={Active:'bg-success',Pending:'bg-warning text-dark',Inactive:'bg-secondary'};
let users=[['Ayesha Khan','ayesha.khan@example.com','Admin','2026-01-12','Active'],['Bilal Ahmed','bilal.ahmed@example.com','Editor','2026-01-28','Active'],['Sara Malik','sara.malik@example.com','Viewer','2026-02-04','Pending'],['Hamza Ali','hamza.ali@example.com','Editor','2026-02-19','Inactive'],['Fatima Noor','fatima.noor@example.com','Admin','2026-03-02','Active'],['Usman Tariq','usman.tariq@example.com','Viewer','2026-03-15','Pending'],['Zainab Shah','zainab.shah@example.com','Editor','2026-04-01','Active'],['Omar Farooq','omar.farooq@example.com','Viewer','2026-04-22','Inactive'],['Hina Raza','hina.raza@example.com','Editor','2026-05-09','Active'],['Daniyal Butt','daniyal.butt@example.com','Viewer','2026-05-30','Pending'],['Maryam Iqbal','maryam.iqbal@example.com','Admin','2026-06-18','Active'],['Talha Mehmood','talha.mehmood@example.com','Viewer','2026-07-07','Inactive']].map((u,i)=>({id:i+1,name:u[0],email:u[1],role:u[2],date:u[3],status:u[4]}));
let page=1,size=5,nextId=13,delId=null;

const av=n=>{const h=[...n].reduce((a,c)=>a+c.charCodeAt(0),0)%360,i=n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
 return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="hsl(${h},55%,36%)"/><text x="40" y="52" font-size="30" fill="#fff" text-anchor="middle" font-family="Arial">${i}</text></svg>`)};
function toast(msg,type='success'){const el=document.createElement('div');el.className=`toast align-items-center text-bg-${type} border-0`;el.setAttribute('role','status');
 el.innerHTML=`<div class="d-flex"><div class="toast-body">${esc(msg)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
 $('#toasts').append(el);el.addEventListener('hidden.bs.toast',()=>el.remove());new bootstrap.Toast(el,{delay:3500}).show()}

/* Router + sidebar */
const titles={dashboard:'Dashboard',users:'User Management',register:'User Registration',settings:'Settings'};
function route(){const v=titles[location.hash.slice(1)]?location.hash.slice(1):'dashboard';
 $$('[data-view-section]').forEach(s=>s.classList.toggle('d-none',s.id!=='view-'+v));
 $$('#sidebar .nav-link').forEach(a=>{const on=a.dataset.view===v;a.classList.toggle('active',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
 $('#pageTitle').textContent=$('#crumb').textContent=titles[v];document.title=titles[v]+' - AdminHub';
 const oc=bootstrap.Offcanvas.getInstance($('#sidebar'));if(oc)oc.hide()}
addEventListener('hashchange',route);
$('#sbToggle').addEventListener('click',()=>{if(innerWidth>=992)document.body.classList.toggle('sb-collapsed');else bootstrap.Offcanvas.getOrCreateInstance($('#sidebar')).toggle()});

/* Dashboard */
const acts=[['Ayesha Khan','Updated system permissions','2 min ago','Completed','success',100],['Sara Malik','Submitted registration request','25 min ago','Pending','warning',40],['Bilal Ahmed','Exported monthly report','1 hour ago','Completed','success',100],['Hamza Ali','Account deactivation review','3 hours ago','In review','info',65],['Fatima Noor','Imported 50 new users','Yesterday','Failed','danger',20]];
$('#acts').innerHTML=acts.map(a=>`<li class="list-group-item"><div class="d-flex gap-3"><img class="avatar" src="${av(a[0])}" alt=""><div class="flex-grow-1"><div class="d-flex flex-wrap justify-content-between gap-1"><strong>${a[0]}</strong><span class="badge bg-${a[4]}${a[4]==='warning'||a[4]==='info'?' text-dark':''}">${a[3]}</span></div><div class="small">${a[1]}</div><div class="small text-muted mb-1">${a[2]}</div><div class="progress" style="height:6px" role="progressbar" aria-label="${a[1]} progress" aria-valuenow="${a[5]}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar bg-${a[4]}" style="width:${a[5]}%"></div></div></div></div></li>`).join('');
$('#navAv').src=av('Muhammad Usman');
function counts(){$('#c-total').textContent=users.length;['Active','Pending','Inactive'].forEach(s=>$('#c-'+s.toLowerCase()).textContent=users.filter(u=>u.status===s).length)}

/* Users table: search, filter, pagination */
function render(){const q=$('#q').value.trim().toLowerCase(),s=$('#sf').value;
 const f=users.filter(u=>(!s||u.status===s)&&(!q||(u.name+' '+u.email+' '+u.role).toLowerCase().includes(q)));
 const pages=Math.max(1,Math.ceil(f.length/size));page=Math.min(page,pages);const st=(page-1)*size,rows=f.slice(st,st+size);
 $('#tb').innerHTML=rows.length?rows.map(u=>`<tr><td><div class="d-flex align-items-center gap-2"><img class="avatar" src="${av(u.name)}" alt="Profile picture of ${esc(u.name)}"><div><div class="fw-semibold">${esc(u.name)}</div><div class="small text-muted d-md-none">${esc(u.email)}</div></div></div></td><td class="d-none d-md-table-cell">${esc(u.email)}</td><td class="d-none d-lg-table-cell">${u.role}</td><td class="d-none d-lg-table-cell">${u.date}</td><td><span class="badge ${BADGE[u.status]}">${u.status}</span></td><td class="text-end text-nowrap"><button class="btn btn-sm btn-outline-primary" data-act="edit" data-id="${u.id}" aria-label="Edit ${esc(u.name)}" data-bs-toggle="tooltip" title="Edit"><i class="bi bi-pencil"></i></button> <button class="btn btn-sm btn-outline-danger" data-act="del" data-id="${u.id}" aria-label="Delete ${esc(u.name)}" data-bs-toggle="tooltip" title="Delete"><i class="bi bi-trash"></i></button></td></tr>`).join(''):'<tr><td colspan="6" class="text-center text-muted py-4">No users match your search.</td></tr>';
 $('#info').textContent=`Showing ${rows.length?st+1:0}-${st+rows.length} of ${f.length} users`;
 let p=`<li class="page-item ${page===1?'disabled':''}"><a class="page-link" href="#" data-p="${page-1}">Previous</a></li>`;
 for(let i=1;i<=pages;i++)p+=`<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#" data-p="${i}" ${i===page?'aria-current="page"':''}>${i}</a></li>`;
 $('#pg').innerHTML=p+`<li class="page-item ${page===pages?'disabled':''}"><a class="page-link" href="#" data-p="${page+1}">Next</a></li>`;
 counts();initTips()}
function initTips(){$$('[data-bs-toggle="tooltip"]').forEach(e=>bootstrap.Tooltip.getOrCreateInstance(e))}
$('#q').addEventListener('input',()=>{page=1;render()});$('#sf').addEventListener('change',()=>{page=1;render()});
$('#pg').addEventListener('click',e=>{e.preventDefault();const a=e.target.closest('[data-p]');if(!a||a.parentElement.classList.contains('disabled'))return;page=+a.dataset.p;render()});

/* Add / Edit / Delete */
const um=new bootstrap.Modal($('#userModal')),dm=new bootstrap.Modal($('#delModal')),uf=$('#userForm');
function openForm(u){uf.classList.remove('was-validated');$('#userModalTitle').textContent=u?'Edit User':'Add User';
 $('#uId').value=u?u.id:'';$('#uName').value=u?u.name:'';$('#uEmail').value=u?u.email:'';$('#uRole').value=u?u.role:'Viewer';$('#uStatus').value=u?u.status:'Pending';um.show()}
$('#addBtn').addEventListener('click',()=>openForm());
$('#tb').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;bootstrap.Tooltip.getInstance(b)?.hide();const u=users.find(x=>x.id==b.dataset.id);
 if(b.dataset.act==='edit')openForm(u);else{delId=u.id;$('#delName').textContent=u.name;dm.show()}});
uf.addEventListener('submit',e=>{e.preventDefault();uf.classList.add('was-validated');if(!uf.checkValidity())return;
 const d={name:$('#uName').value.trim(),email:$('#uEmail').value.trim(),role:$('#uRole').value,status:$('#uStatus').value},id=$('#uId').value;
 if(id){Object.assign(users.find(x=>x.id==id),d);toast('User updated')}else{users.push({id:nextId++,date:new Date().toISOString().slice(0,10),...d});toast('User added')}
 um.hide();render()});
$('#delOk').addEventListener('click',()=>{users=users.filter(u=>u.id!==delId);dm.hide();toast('User deleted','danger');render()});

/* Generic form validation */
function matchPw(f){const p=f.querySelector('[name=pw]'),c=f.querySelector('[name=cpw]');if(p&&c)c.setCustomValidity(c.value&&c.value!==p.value?'Passwords do not match':'')}
function genderCheck(f){const r=$$('[name=gender]',f);if(r.length)$('.gender-fb',f).style.cssText=r.some(x=>x.checked)?'display:none!important':'display:block!important'}
$$('form.needs-validation').forEach(f=>{
 if(f.id==='userForm')return;
 f.addEventListener('input',()=>matchPw(f));
 f.addEventListener('submit',e=>{e.preventDefault();matchPw(f);const ok=f.checkValidity();f.classList.add('was-validated');if(f.id==='regForm')genderCheck(f);
  if(!ok){e.stopPropagation();f.querySelector(':invalid')?.focus();toast('Please fix the highlighted fields','danger');return}
  toast(f.dataset.msg||'Registration successful');
  if(f.id==='regForm'||f.hasAttribute('data-reset')){f.reset();f.classList.remove('was-validated');$('#prev').classList.add('d-none')}})});
$('#regForm').addEventListener('reset',()=>$('#prev').classList.add('d-none'));
$$('[name=gender]').forEach(r=>r.addEventListener('change',()=>genderCheck($('#regForm'))));
$('#rImg').addEventListener('change',e=>{const f=e.target.files[0],i=e.target;
 if(f&&(!f.type.startsWith('image/')||f.size>2097152)){i.setCustomValidity('bad');$('#prev').classList.add('d-none')}
 else{i.setCustomValidity('');if(f){$('#prev').src=URL.createObjectURL(f);$('#prev').classList.remove('d-none')}}});
$$('form.save-form:not(.needs-validation)').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();toast(f.dataset.msg)}));

/* Dropdown actions */
$('#markRead').addEventListener('click',()=>{$('#nBadge').remove();toast('All notifications marked as read','info')});
$('#logout').addEventListener('click',()=>toast('Logged out (demo only)','secondary'));
initTips();route();render();
