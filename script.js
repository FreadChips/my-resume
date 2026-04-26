/* =============================================
   Resume Builder - Application Logic
   ============================================= */

// --- Data Model ---
let data = {
  basics: { name: '', title: '', email: '', phone: '', location: '', website: '', avatar: '' },
  profile: '',
  work: [],
  education: [],
  projects: [],
  skills: '',
  languages: '',
  certificates: '',
  settings: {
    layout: 'classic',
    theme: 'blue',
    visibility: {
      profile: true, work: true, education: true,
      projects: true, skills: true, languages: true, certificates: true
    }
  }
};

// --- Utility ---
function $(id) { return document.getElementById(id); }

function debounce(fn, ms) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

// --- Initialization ---
function init() {
  loadFromStorage();
  applyDataToForm();
  rebuildDynamicLists();
  updateThemeUI();
  updateLayoutUI();
  updateVisibilityUI();
  renderPreview();
}

// --- Editor: Collapse Sections ---
function toggleSection(headerEl) {
  headerEl.classList.toggle('collapsed');
}

// --- Form <-> Data Sync ---
function onFormChange() {
  collectFormData();
  saveToStorage();
  renderPreview();
}

function collectFormData() {
  data.basics.name = $('input-name').value;
  data.basics.title = $('input-title').value;
  data.basics.email = $('input-email').value;
  data.basics.phone = $('input-phone').value;
  data.basics.location = $('input-location').value;
  data.basics.website = $('input-website').value;
  data.profile = $('input-profile').value;
  data.skills = $('input-skills').value;
  data.languages = $('input-languages').value;
  data.certificates = $('input-certificates').value;

  // Dynamic lists already updated via add/remove/itemChange
}

function applyDataToForm() {
  $('input-name').value = data.basics.name || '';
  $('input-title').value = data.basics.title || '';
  $('input-email').value = data.basics.email || '';
  $('input-phone').value = data.basics.phone || '';
  $('input-location').value = data.basics.location || '';
  $('input-website').value = data.basics.website || '';
  $('input-profile').value = data.profile || '';
  $('input-skills').value = data.skills || '';
  $('input-languages').value = data.languages || '';
  $('input-certificates').value = data.certificates || '';

  // Avatar
  updateAvatarPreview();
}

// --- Dynamic List Management ---
function rebuildDynamicLists() {
  renderWorkList();
  renderEducationList();
  renderProjectList();
}

function renderWorkList() {
  const container = $('work-list');
  container.innerHTML = '';
  data.work.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="item-header">
        <span class="item-index">#${i + 1}</span>
        <button class="btn-remove" onclick="removeWorkItem(${i})" title="删除">✕</button>
      </div>
      <div class="form-group">
        <label>公司</label>
        <input type="text" value="${escapeHtml(item.company)}" data-work="${i}" data-field="company" oninput="onWorkChange(${i}, 'company', this.value)">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>职位</label>
          <input type="text" value="${escapeHtml(item.position)}" data-work="${i}" data-field="position" oninput="onWorkChange(${i}, 'position', this.value)">
        </div>
        <div class="form-group">
          <label>时间</label>
          <input type="text" value="${escapeHtml(item.startDate)}" placeholder="开始" style="width:48%;display:inline-block" oninput="onWorkChange(${i}, 'startDate', this.value)">
          <span style="display:inline-block;width:4%;text-align:center;color:#999">-</span>
          <input type="text" value="${escapeHtml(item.endDate)}" placeholder="结束" style="width:48%;display:inline-block" oninput="onWorkChange(${i}, 'endDate', this.value)">
        </div>
      </div>
      <div class="form-group">
        <label>工作描述</label>
        <textarea rows="3" oninput="onWorkChange(${i}, 'description', this.value)">${escapeHtml(item.description)}</textarea>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderEducationList() {
  const container = $('education-list');
  container.innerHTML = '';
  data.education.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="item-header">
        <span class="item-index">#${i + 1}</span>
        <button class="btn-remove" onclick="removeEducationItem(${i})" title="删除">✕</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>学校</label>
          <input type="text" value="${escapeHtml(item.school)}" oninput="onEducationChange(${i}, 'school', this.value)">
        </div>
        <div class="form-group">
          <label>学位</label>
          <input type="text" value="${escapeHtml(item.degree)}" oninput="onEducationChange(${i}, 'degree', this.value)">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>开始时间</label>
          <input type="text" value="${escapeHtml(item.startDate)}" oninput="onEducationChange(${i}, 'startDate', this.value)">
        </div>
        <div class="form-group">
          <label>结束时间</label>
          <input type="text" value="${escapeHtml(item.endDate)}" oninput="onEducationChange(${i}, 'endDate', this.value)">
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderProjectList() {
  const container = $('project-list');
  container.innerHTML = '';
  data.projects.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="item-header">
        <span class="item-index">#${i + 1}</span>
        <button class="btn-remove" onclick="removeProjectItem(${i})" title="删除">✕</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>项目名称</label>
          <input type="text" value="${escapeHtml(item.name)}" oninput="onProjectChange(${i}, 'name', this.value)">
        </div>
        <div class="form-group">
          <label>时间</label>
          <input type="text" value="${escapeHtml(item.date)}" oninput="onProjectChange(${i}, 'date', this.value)">
        </div>
      </div>
      <div class="form-group">
        <label>项目描述</label>
        <textarea rows="3" oninput="onProjectChange(${i}, 'description', this.value)">${escapeHtml(item.description)}</textarea>
      </div>
    `;
    container.appendChild(div);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// --- Work CRUD ---
function addWorkItem() {
  data.work.push({ company: '', position: '', startDate: '', endDate: '', description: '' });
  renderWorkList();
  onFormChange();
}
function removeWorkItem(index) {
  data.work.splice(index, 1);
  renderWorkList();
  onFormChange();
}
function onWorkChange(index, field, value) {
  data.work[index][field] = value;
  saveToStorage();
  renderPreview();
}

// --- Education CRUD ---
function addEducationItem() {
  data.education.push({ school: '', degree: '', startDate: '', endDate: '' });
  renderEducationList();
  onFormChange();
}
function removeEducationItem(index) {
  data.education.splice(index, 1);
  renderEducationList();
  onFormChange();
}
function onEducationChange(index, field, value) {
  data.education[index][field] = value;
  saveToStorage();
  renderPreview();
}

// --- Project CRUD ---
function addProjectItem() {
  data.projects.push({ name: '', date: '', description: '' });
  renderProjectList();
  onFormChange();
}
function removeProjectItem(index) {
  data.projects.splice(index, 1);
  renderProjectList();
  onFormChange();
}
function onProjectChange(index, field, value) {
  data.projects[index][field] = value;
  saveToStorage();
  renderPreview();
}

// --- Avatar ---
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过 2MB');
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    data.basics.avatar = e.target.result;
    updateAvatarPreview();
    saveToStorage();
    renderPreview();
  };
  reader.readAsDataURL(file);
}

function removeAvatar() {
  data.basics.avatar = '';
  updateAvatarPreview();
  saveToStorage();
  renderPreview();
}

function updateAvatarPreview() {
  const container = $('avatar-preview');
  if (data.basics.avatar) {
    container.innerHTML = `<img src="${escapeHtml(data.basics.avatar)}" alt="头像">`;
  } else {
    container.innerHTML = '<span class="avatar-placeholder">📷</span>';
  }
}

// --- Theme, Layout, Visibility ---
function changeTheme(theme) {
  data.settings.theme = theme;
  updateThemeUI();
  saveToStorage();
  renderPreview();
}

function changeLayout(layout) {
  data.settings.layout = layout;
  updateLayoutUI();
  saveToStorage();
  renderPreview();
}

function toggleModule(checkbox) {
  const module = checkbox.getAttribute('data-module');
  data.settings.visibility[module] = checkbox.checked;
  saveToStorage();
  renderPreview();
}

function updateThemeUI() {
  document.querySelectorAll('#theme-selector .theme-option').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-value') === data.settings.theme);
  });
}

function updateLayoutUI() {
  document.querySelectorAll('#layout-selector .theme-option').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-value') === data.settings.layout);
  });
}

function updateVisibilityUI() {
  document.querySelectorAll('#visibility-controls input[type="checkbox"]').forEach(cb => {
    const mod = cb.getAttribute('data-module');
    cb.checked = data.settings.visibility[mod] !== false;
  });
}

// --- Local Storage ---
const STORAGE_KEY = 'resume-builder-data';

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // storage full or unavailable — silently ignore
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Merge deeply to preserve structure if new fields added later
      deepMerge(data, saved);
    }
  } catch (e) {
    // corrupted data — ignore
  }
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

// --- Clear Data ---
function clearData() {
  if (!confirm('确定要清除所有数据吗？此操作不可恢复。')) return;
  localStorage.removeItem(STORAGE_KEY);
  // Reset to defaults
  data = {
    basics: { name: '', title: '', email: '', phone: '', location: '', website: '', avatar: '' },
    profile: '',
    work: [],
    education: [],
    projects: [],
    skills: '',
    languages: '',
    certificates: '',
    settings: {
      layout: 'classic',
      theme: 'blue',
      visibility: {
        profile: true, work: true, education: true,
        projects: true, skills: true, languages: true, certificates: true
      }
    }
  };
  applyDataToForm();
  rebuildDynamicLists();
  updateThemeUI();
  updateLayoutUI();
  updateVisibilityUI();
  renderPreview();
}

// --- Sample Data ---
function loadSampleData() {
  data = {
    basics: {
      name: '张明华',
      title: '高级前端开发工程师',
      email: 'zhangminghua@email.com',
      phone: '138-0000-1234',
      location: '北京市朝阳区',
      website: 'https://github.com/zhangminghua',
      avatar: ''
    },
    profile: '拥有 6 年前端开发经验，专注于 React 生态与性能优化。曾在电商、金融科技领域主导多个大型项目的前端架构设计。具备良好的团队协作能力与技术分享精神，致力于构建高质量、可维护的 Web 应用。',
    work: [
      {
        company: '字节跳动',
        position: '高级前端工程师',
        startDate: '2022.03',
        endDate: '至今',
        description: '• 负责抖音电商后台管理系统前端架构设计与开发\n• 推动微前端架构落地，将单体应用拆分为 12 个独立子应用\n• 建立前端监控体系，页面性能提升 40%，错误率降低 60%\n• 指导 3 名初级工程师，主持内部技术分享'
      },
      {
        company: '阿里巴巴',
        position: '前端开发工程师',
        startDate: '2019.07',
        endDate: '2022.02',
        description: '• 参与淘宝商家中心核心模块开发，日活超 100 万\n• 使用 React + TypeScript 重构遗留 jQuery 项目，代码量减少 35%\n• 设计通用组件库，覆盖 20+ 业务场景，提升团队开发效率'
      },
      {
        company: '美团',
        position: '前端开发实习生',
        startDate: '2018.06',
        endDate: '2019.06',
        description: '• 参与美团外卖商家端 Web App 开发\n• 负责活动页面搭建，支持大促期间高并发访问'
      }
    ],
    education: [
      {
        school: '北京大学',
        degree: '硕士 · 计算机科学与技术',
        startDate: '2016.09',
        endDate: '2019.06'
      },
      {
        school: '武汉大学',
        degree: '学士 · 软件工程',
        startDate: '2012.09',
        endDate: '2016.06'
      }
    ],
    projects: [
      {
        name: '电商中台管理系统',
        date: '2023.01 - 2023.08',
        description: '基于 React 18 + TypeScript + Ant Design 构建的大型 B 端管理系统。采用微前端架构（qiankun），实现多团队协作开发。集成 ECharts 数据可视化、WebSocket 实时消息推送、RBAC 权限管理。'
      },
      {
        name: '前端性能监控平台',
        date: '2022.06 - 2022.12',
        description: '自研前端性能监控（RUM）平台，采集 Core Web Vitals 指标，支持 SourceMap 错误定位。日均处理 500 万+ 数据点，使用 Service Worker 实现离线上报。'
      }
    ],
    skills: '前端: React, Vue, TypeScript, Webpack, Vite\n后端: Node.js, Express, Python\n工程化: Docker, CI/CD, Nginx, Linux\n其他: WebGL, Three.js, 性能优化',
    languages: '中文（母语）\n英语（流利，CET-6，技术文档阅读与撰写）',
    certificates: 'PMP 项目管理专业人士\nAWS Solutions Architect Associate\n阿里云 ACE 认证',
    settings: {
      layout: 'classic',
      theme: 'blue',
      visibility: {
        profile: true, work: true, education: true,
        projects: true, skills: true, languages: true, certificates: true
      }
    }
  };
  applyDataToForm();
  rebuildDynamicLists();
  updateThemeUI();
  updateLayoutUI();
  updateVisibilityUI();
  saveToStorage();
  renderPreview();
}

// =============================================
// RESUME RENDERER
// =============================================

function renderPreview() {
  const container = $('resume-preview');
  const hasContent = data.basics.name || data.work.length || data.education.length;

  if (!hasContent) {
    container.classList.add('empty');
    return;
  }
  container.classList.remove('empty');

  // Set theme + layout classes
  container.className = 'resume-preview theme-' + data.settings.theme + ' layout-' + data.settings.layout;

  const vis = data.settings.visibility;
  let html = '';

  if (data.settings.layout === 'modern') {
    html = renderModern(vis);
  } else if (data.settings.layout === 'creative') {
    html = renderCreative(vis);
  } else {
    html = renderClassic(vis);
  }

  container.innerHTML = html;
}

// --- Classic Layout ---
function renderClassic(vis) {
  let html = '';
  // Header — flex row: info left, avatar right
  html += '<div class="resume-header">';
  html += '<div class="header-info">';
  html += `<div class="resume-name">${esc(data.basics.name)}</div>`;
  if (data.basics.title) html += `<div class="resume-title">${esc(data.basics.title)}</div>`;
  html += '<div class="resume-contact">';
  if (data.basics.email) html += `<span>✉ ${esc(data.basics.email)}</span>`;
  if (data.basics.phone) html += `<span>📞 ${esc(data.basics.phone)}</span>`;
  if (data.basics.location) html += `<span>📍 ${esc(data.basics.location)}</span>`;
  if (data.basics.website) html += `<span>🔗 ${esc(data.basics.website)}</span>`;
  html += '</div></div>';
  if (data.basics.avatar) {
    html += `<div class="resume-avatar-section"><img class="resume-avatar" src="${escapeHtml(data.basics.avatar)}" alt="avatar"></div>`;
  }
  html += '</div>';

  // Body
  html += '<div class="resume-body">';

  // Profile
  if (vis.profile && data.profile) {
    html += `<div class="resume-section">
      <div class="resume-section-title">个人简介</div>
      <div class="resume-text">${esc(data.profile)}</div>
    </div>`;
  }

  // Work
  if (vis.work && data.work.length) {
    html += '<div class="resume-section"><div class="resume-section-title">工作经历</div>';
    data.work.forEach(w => {
      if (!w.company) return;
      html += '<div class="resume-item"><div class="resume-item-header">';
      html += `<div><span class="resume-item-title">${esc(w.company)}</span>`;
      if (w.position) html += ` <span class="resume-item-sub">${esc(w.position)}</span>`;
      html += '</div>';
      if (w.startDate || w.endDate) html += `<div class="resume-item-date">${esc(w.startDate)} - ${esc(w.endDate)}</div>`;
      html += '</div>';
      if (w.description) html += `<div class="resume-item-desc">${esc(w.description)}</div>`;
      html += '</div>';
    });
    html += '</div>';
  }

  // Education
  if (vis.education && data.education.length) {
    html += '<div class="resume-section"><div class="resume-section-title">教育背景</div>';
    data.education.forEach(e => {
      if (!e.school) return;
      html += '<div class="resume-item"><div class="resume-item-header">';
      html += `<div><span class="resume-item-title">${esc(e.school)}</span>`;
      if (e.degree) html += ` <span class="resume-item-sub">${esc(e.degree)}</span>`;
      html += '</div>';
      if (e.startDate || e.endDate) html += `<div class="resume-item-date">${esc(e.startDate)} - ${esc(e.endDate)}</div>`;
      html += '</div></div>';
    });
    html += '</div>';
  }

  // Projects
  if (vis.projects && data.projects.length) {
    html += '<div class="resume-section"><div class="resume-section-title">项目经历</div>';
    data.projects.forEach(p => {
      if (!p.name) return;
      html += '<div class="resume-item"><div class="resume-item-header">';
      html += `<span class="resume-item-title">${esc(p.name)}</span>`;
      if (p.date) html += `<span class="resume-item-date">${esc(p.date)}</span>`;
      html += '</div>';
      if (p.description) html += `<div class="resume-item-desc">${esc(p.description)}</div>`;
      html += '</div>';
    });
    html += '</div>';
  }

  // Skills
  if (vis.skills && data.skills) {
    const skillLines = data.skills.split('\n').filter(s => s.trim());
    html += '<div class="resume-section"><div class="resume-section-title">技能</div>';
    skillLines.forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const cat = line.substring(0, colonIdx).trim();
        const skills = line.substring(colonIdx + 1).trim();
        html += `<div class="resume-skill-category"><span class="skill-cat-name">${esc(cat)}：</span>`;
        skills.split(',').forEach(s => {
          html += `<span class="resume-tag outline">${esc(s.trim())}</span> `;
        });
        html += '</div>';
      } else {
        html += `<span class="resume-tag">${esc(line.trim())}</span> `;
      }
    });
    html += '</div>';
  }

  // Languages
  if (vis.languages && data.languages) {
    const lines = data.languages.split('\n').filter(s => s.trim());
    html += '<div class="resume-section"><div class="resume-section-title">语言能力</div><div class="resume-tags">';
    lines.forEach(l => { html += `<span class="resume-tag">${esc(l.trim())}</span> `; });
    html += '</div></div>';
  }

  // Certificates
  if (vis.certificates && data.certificates) {
    const lines = data.certificates.split('\n').filter(s => s.trim());
    html += '<div class="resume-section"><div class="resume-section-title">证书</div><div class="resume-tags">';
    lines.forEach(c => { html += `<span class="resume-tag">${esc(c.trim())}</span> `; });
    html += '</div></div>';
  }

  html += '</div>'; // end body
  return html;
}

// --- Modern Layout (sidebar) ---
function renderModern(vis) {
  let sidebar = '';
  let main = '';

  // === Sidebar ===
  sidebar += '<div class="resume-sidebar">';

  if (data.basics.avatar) {
    sidebar += `<img class="resume-avatar" src="${escapeHtml(data.basics.avatar)}" alt="avatar">`;
  }
  sidebar += `<div class="resume-name">${esc(data.basics.name)}</div>`;
  if (data.basics.title) sidebar += `<div class="resume-title">${esc(data.basics.title)}</div>`;

  // Contact in sidebar
  sidebar += '<div class="resume-contact">';
  if (data.basics.email) sidebar += `<div>✉ ${esc(data.basics.email)}</div>`;
  if (data.basics.phone) sidebar += `<div>📞 ${esc(data.basics.phone)}</div>`;
  if (data.basics.location) sidebar += `<div>📍 ${esc(data.basics.location)}</div>`;
  if (data.basics.website) sidebar += `<div>🔗 ${esc(data.basics.website)}</div>`;
  sidebar += '</div>';

  // Skills in sidebar
  if (vis.skills && data.skills) {
    sidebar += '<div class="sidebar-section"><div class="sidebar-section-title">技能</div>';
    const skillLines = data.skills.split('\n').filter(s => s.trim());
    skillLines.forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const cat = line.substring(0, colonIdx).trim();
        const skills = line.substring(colonIdx + 1).trim();
        sidebar += `<div style="margin-bottom:6px"><div style="font-size:8pt;opacity:0.7;margin-bottom:2px">${esc(cat)}</div>`;
        skills.split(',').forEach(s => {
          sidebar += `<span class="sidebar-tag">${esc(s.trim())}</span>`;
        });
        sidebar += '</div>';
      } else {
        sidebar += `<span class="sidebar-tag">${esc(line.trim())}</span>`;
      }
    });
    sidebar += '</div>';
  }

  // Languages in sidebar
  if (vis.languages && data.languages) {
    sidebar += '<div class="sidebar-section"><div class="sidebar-section-title">语言</div>';
    data.languages.split('\n').filter(s => s.trim()).forEach(l => {
      sidebar += `<div class="sidebar-text">${esc(l.trim())}</div>`;
    });
    sidebar += '</div>';
  }

  // Certificates in sidebar
  if (vis.certificates && data.certificates) {
    sidebar += '<div class="sidebar-section"><div class="sidebar-section-title">证书</div>';
    data.certificates.split('\n').filter(s => s.trim()).forEach(c => {
      sidebar += `<div class="sidebar-text">• ${esc(c.trim())}</div>`;
    });
    sidebar += '</div>';
  }

  sidebar += '</div>'; // end sidebar

  // === Main ===
  main += '<div class="resume-main">';

  // Profile
  if (vis.profile && data.profile) {
    main += `<div class="resume-section">
      <div class="resume-section-title">个人简介</div>
      <div class="resume-text">${esc(data.profile)}</div>
    </div>`;
  }

  // Work
  if (vis.work && data.work.length) {
    main += '<div class="resume-section"><div class="resume-section-title">工作经历</div>';
    data.work.forEach(w => {
      if (!w.company) return;
      main += '<div class="resume-item"><div class="resume-item-header">';
      main += `<div><span class="resume-item-title">${esc(w.company)}</span>`;
      if (w.position) main += ` <span class="resume-item-sub">${esc(w.position)}</span>`;
      main += '</div>';
      if (w.startDate || w.endDate) main += `<div class="resume-item-date">${esc(w.startDate)} - ${esc(w.endDate)}</div>`;
      main += '</div>';
      if (w.description) main += `<div class="resume-item-desc">${esc(w.description)}</div>`;
      main += '</div>';
    });
    main += '</div>';
  }

  // Education
  if (vis.education && data.education.length) {
    main += '<div class="resume-section"><div class="resume-section-title">教育背景</div>';
    data.education.forEach(e => {
      if (!e.school) return;
      main += '<div class="resume-item"><div class="resume-item-header">';
      main += `<span class="resume-item-title">${esc(e.school)}</span>`;
      if (e.degree) main += ` <span class="resume-item-sub">${esc(e.degree)}</span>`;
      main += '</div></div>';
    });
    main += '</div>';
  }

  // Projects
  if (vis.projects && data.projects.length) {
    main += '<div class="resume-section"><div class="resume-section-title">项目经历</div>';
    data.projects.forEach(p => {
      if (!p.name) return;
      main += '<div class="resume-item"><div class="resume-item-header">';
      main += `<span class="resume-item-title">${esc(p.name)}</span>`;
      if (p.date) main += `<span class="resume-item-date">${esc(p.date)}</span>`;
      main += '</div>';
      if (p.description) main += `<div class="resume-item-desc">${esc(p.description)}</div>`;
      main += '</div>';
    });
    main += '</div>';
  }

  main += '</div>'; // end main

  return sidebar + main;
}

// --- Minimal Layout ---
function renderCreative(vis) {
  let html = '';

  // Colored accent bar on the left
  html += '<div class="creative-accent"></div>';
  html += '<div class="creative-content">';

  // === Header ===
  html += '<div class="creative-header">';
  if (data.basics.avatar) {
    html += `<div class="creative-avatar-wrap"><img class="creative-avatar" src="${escapeHtml(data.basics.avatar)}" alt="avatar"></div>`;
  }
  html += `<div class="creative-name">${esc(data.basics.name)}</div>`;
  html += '<div class="creative-name-bar"></div>';
  if (data.basics.title) {
    html += `<div class="creative-title-badge">${esc(data.basics.title)}</div>`;
  }
  html += '<div class="creative-contact">';
  const cParts = [];
  if (data.basics.email) cParts.push(esc(data.basics.email));
  if (data.basics.phone) cParts.push(esc(data.basics.phone));
  if (data.basics.location) cParts.push(esc(data.basics.location));
  if (data.basics.website) cParts.push(esc(data.basics.website));
  html += cParts.join(' <span class="creative-dot">•</span> ');
  html += '</div></div>';

  // === Body ===
  html += '<div class="creative-body">';

  // Profile
  if (vis.profile && data.profile) {
    html += '<div class="creative-section">';
    html += '<div class="creative-section-title"><span class="creative-section-line"></span>个人简介</div>';
    html += `<div class="creative-text">${esc(data.profile)}</div>`;
    html += '</div>';
  }

  // Work — timeline
  if (vis.work && data.work.length) {
    html += '<div class="creative-section">';
    html += '<div class="creative-section-title"><span class="creative-section-line"></span>工作经历</div>';
    html += '<div class="creative-timeline">';
    data.work.forEach(w => {
      if (!w.company) return;
      html += '<div class="creative-tl-item">';
      html += '<div class="creative-tl-marker"><div class="creative-tl-dot"></div></div>';
      html += '<div class="creative-tl-content">';
      html += '<div class="creative-tl-header">';
      html += `<span class="creative-tl-title">${esc(w.company)}</span>`;
      if (w.position) html += `<span class="creative-tl-sub">${esc(w.position)}</span>`;
      html += `<span class="creative-tl-date">${esc(w.startDate)} - ${esc(w.endDate)}</span>`;
      html += '</div>';
      if (w.description) html += `<div class="creative-tl-desc">${esc(w.description)}</div>`;
      html += '</div></div>';
    });
    html += '</div></div>';
  }

  // Education — cards
  if (vis.education && data.education.length) {
    html += '<div class="creative-section">';
    html += '<div class="creative-section-title"><span class="creative-section-line"></span>教育背景</div>';
    data.education.forEach(e => {
      if (!e.school) return;
      html += '<div class="creative-edu-item">';
      html += `<span class="creative-edu-school">${esc(e.school)}</span>`;
      if (e.degree) html += `<span class="creative-edu-degree">${esc(e.degree)}</span>`;
      if (e.startDate || e.endDate) html += `<span class="creative-edu-date">${esc(e.startDate)} - ${esc(e.endDate)}</span>`;
      html += '</div>';
    });
    html += '</div>';
  }

  // Projects — left border accent
  if (vis.projects && data.projects.length) {
    html += '<div class="creative-section">';
    html += '<div class="creative-section-title"><span class="creative-section-line"></span>项目经历</div>';
    data.projects.forEach(p => {
      if (!p.name) return;
      html += '<div class="creative-project-item">';
      html += '<div class="creative-project-header">';
      html += `<span class="creative-project-name">${esc(p.name)}</span>`;
      if (p.date) html += `<span class="creative-project-date">${esc(p.date)}</span>`;
      html += '</div>';
      if (p.description) html += `<div class="creative-project-desc">${esc(p.description)}</div>`;
      html += '</div>';
    });
    html += '</div>';
  }

  // Skills — pill tags
  if (vis.skills && data.skills) {
    html += '<div class="creative-section">';
    html += '<div class="creative-section-title"><span class="creative-section-line"></span>技能</div>';
    const lines = data.skills.split('\n').filter(s => s.trim());
    lines.forEach(line => {
      const ci = line.indexOf(':');
      if (ci > 0) {
        const cat = line.substring(0, ci).trim();
        const skills = line.substring(ci + 1).trim();
        html += `<div class="creative-skill-cat"><span class="creative-skill-label">${esc(cat)}</span>`;
        skills.split(',').forEach(s => {
          html += `<span class="creative-skill-tag">${esc(s.trim())}</span>`;
        });
        html += '</div>';
      } else {
        html += `<span class="creative-skill-tag">${esc(line.trim())}</span>`;
      }
    });
    html += '</div>';
  }

  // Languages — pill tags
  if (vis.languages && data.languages) {
    html += '<div class="creative-section">';
    html += '<div class="creative-section-title"><span class="creative-section-line"></span>语言能力</div>';
    html += '<div class="creative-tags">';
    data.languages.split('\n').filter(s => s.trim()).forEach(l => {
      html += `<span class="creative-lang-tag">${esc(l.trim())}</span>`;
    });
    html += '</div></div>';
  }

  // Certificates
  if (vis.certificates && data.certificates) {
    html += '<div class="creative-section">';
    html += '<div class="creative-section-title"><span class="creative-section-line"></span>证书</div>';
    data.certificates.split('\n').filter(s => s.trim()).forEach(c => {
      html += `<div class="creative-cert-item">${esc(c.trim())}</div>`;
    });
    html += '</div>';
  }

  html += '</div>'; // end body
  html += '</div>'; // end content
  return html;
}

// --- Escaping helper for text content ---
// (escapeHtml is used for attributes; esc is for text content)
function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// =============================================
// EXPORT FUNCTIONS
// =============================================

function refreshPreview() {
  renderPreview();
}

// --- Export PDF (via window.print) ---
function exportPDF() {
  // Ensure preview is rendered
  renderPreview();

  // Before printing, temporarily hide editor and show only the preview
  // The @media print rules in CSS handle this automatically
  window.print();
}

// --- Export HTML (standalone file) ---
function exportHTML() {
  renderPreview();

  // Get the preview HTML content
  const previewEl = $('resume-preview');
  const previewHTML = previewEl.innerHTML;
  const theme = data.settings.theme;
  const layout = data.settings.layout;

  // Build a standalone HTML document
  const cssContent = getPreviewCSS(theme, layout);

  const doc = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(data.basics.name || '简历')}</title>
  <style>
${cssContent}
  </style>
</head>
<body>
  <div class="resume-preview theme-${theme} layout-${layout}">
    ${previewHTML}
  </div>
  <script>window.onload=function(){window.print();}<\/script>
</body>
</html>`;

  downloadFile(doc, `${data.basics.name || 'resume'}.html`, 'text/html');
}

function getPreviewCSS(theme, layout) {
  // Extract preview-relevant CSS rules
  return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", sans-serif; background: #f3f4f6; padding: 32px; display: flex; justify-content: center; }
.resume-preview { width: 210mm; min-height: 297mm; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-size: 11pt; line-height: 1.5; color: #333; position: relative; overflow: hidden; }
.resume-header { padding: 30px 32px 20px; text-align: center; }
.resume-header .resume-name { font-size: 26pt; font-weight: 700; letter-spacing: 2px; margin-bottom: 4px; }
.resume-header .resume-title { font-size: 12pt; font-weight: 400; opacity: 0.8; margin-bottom: 12px; }
.resume-header .resume-contact { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 16px; font-size: 9pt; opacity: 0.75; }
.resume-header .resume-contact span { white-space: nowrap; }
.resume-avatar-section { text-align: center; padding: 20px 32px 0; }
.resume-avatar { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid #e5e7eb; }
.resume-body { padding: 0 32px 30px; }
.resume-section { margin-bottom: 18px; }
.resume-section:last-child { margin-bottom: 0; }
.resume-section-title { font-size: 12pt; font-weight: 700; padding-bottom: 6px; margin-bottom: 10px; border-bottom: 2px solid; letter-spacing: 1px; }
.resume-text { font-size: 10pt; line-height: 1.7; color: #555; white-space: pre-wrap; }
.resume-item { margin-bottom: 14px; }
.resume-item:last-child { margin-bottom: 0; }
.resume-item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px; }
.resume-item-title { font-weight: 600; font-size: 10.5pt; color: #222; }
.resume-item-sub { font-size: 10pt; color: #555; }
.resume-item-date { font-size: 9pt; color: #999; white-space: nowrap; }
.resume-item-desc { font-size: 9.5pt; color: #555; line-height: 1.6; white-space: pre-wrap; }
.resume-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.resume-tag { padding: 3px 10px; border-radius: 3px; font-size: 9pt; color: #fff; line-height: 1.5; display: inline-block; margin: 2px; }
.resume-tag.outline { background: transparent !important; border: 1px solid; }
.resume-skill-category { margin-bottom: 8px; }
.resume-skill-category:last-child { margin-bottom: 0; }
.resume-skill-category .skill-cat-name { font-weight: 600; font-size: 9.5pt; margin-right: 6px; }

/* Layout: Classic */
.layout-classic .resume-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; }
.layout-classic .resume-header .header-info { flex: 1; }
.layout-classic .resume-header .resume-contact { justify-content: flex-start; }
.layout-classic .resume-avatar-section { padding: 0; flex-shrink: 0; margin-left: 24px; }
.layout-classic .resume-avatar { width: 95px; height: 130px; border-radius: 4px; object-fit: cover; border: 2px solid #d1d5db; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

/* Layout: Modern */
.layout-modern { display: flex; min-height: 297mm; }
.layout-modern .resume-sidebar { width: 210px; flex-shrink: 0; padding: 30px 20px; color: #fff; }
.layout-modern .resume-sidebar .resume-avatar { border-color: rgba(255,255,255,0.3); display: block; margin: 0 auto 16px; border-radius: 4px; width: 100px; height: 130px; object-fit: cover; }
.layout-modern .resume-sidebar .resume-name { font-size: 20pt; font-weight: 700; text-align: center; margin-bottom: 2px; letter-spacing: 1px; }
.layout-modern .resume-sidebar .resume-title { font-size: 10pt; text-align: center; opacity: 0.85; margin-bottom: 16px; font-weight: 400; }
.layout-modern .resume-sidebar .resume-contact { font-size: 8.5pt; line-height: 1.8; margin-bottom: 20px; }
.layout-modern .resume-sidebar .resume-contact div { display: flex; align-items: center; gap: 6px; opacity: 0.85; }
.layout-modern .resume-sidebar .sidebar-section { margin-bottom: 16px; }
.layout-modern .resume-sidebar .sidebar-section-title { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 4px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.25); }
.layout-modern .resume-sidebar .sidebar-tag { display: inline-block; padding: 2px 8px; margin: 0 4px 4px 0; font-size: 8pt; border-radius: 2px; background: rgba(255,255,255,0.15); }
.layout-modern .resume-sidebar .sidebar-text { font-size: 8.5pt; opacity: 0.85; line-height: 1.6; white-space: pre-wrap; }
.layout-modern .resume-main { flex: 1; padding: 30px 28px; }

/* Layout: Creative */
.layout-creative { position: relative; }
.creative-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 5px; }
.creative-content { margin-left: 5px; }
.creative-header { padding: 36px 36px 20px; position: relative; }
.creative-avatar-wrap { position: absolute; top: 30px; right: 36px; }
.creative-avatar { width: 80px; height: 80px; border-radius: 4px; object-fit: cover; border: 3px solid; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
.creative-name { font-size: 32pt; font-weight: 800; letter-spacing: 1px; line-height: 1.1; }
.creative-name-bar { width: 64px; height: 5px; border-radius: 3px; margin: 10px 0 14px; }
.creative-title-badge { display: inline-block; font-size: 10pt; font-weight: 600; padding: 4px 16px; border-radius: 99px; color: #fff; margin-bottom: 12px; }
.creative-contact { font-size: 9pt; opacity: 0.65; }
.creative-dot { margin: 0 6px; opacity: 0.4; }
.creative-body { padding: 4px 36px 32px; }
.creative-section { margin-bottom: 24px; }
.creative-section-title { display: flex; align-items: center; gap: 10px; font-size: 11pt; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
.creative-section-line { display: inline-block; width: 4px; height: 18px; border-radius: 2px; flex-shrink: 0; }
.creative-text { font-size: 9.5pt; line-height: 1.7; color: #555; white-space: pre-wrap; }
.creative-timeline { position: relative; padding-left: 24px; }
.creative-timeline::before { content: ''; position: absolute; left: 7px; top: 8px; bottom: 4px; width: 2px; opacity: 0.2; }
.creative-tl-item { position: relative; margin-bottom: 20px; }
.creative-tl-marker { position: absolute; left: -24px; top: 4px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
.creative-tl-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid; background: #fff; }
.creative-tl-header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; margin-bottom: 4px; }
.creative-tl-title { font-weight: 700; font-size: 11pt; }
.creative-tl-sub { font-size: 9.5pt; opacity: 0.75; }
.creative-tl-date { font-size: 8.5pt; opacity: 0.5; margin-left: auto; white-space: nowrap; }
.creative-tl-desc { font-size: 9pt; line-height: 1.6; opacity: 0.7; white-space: pre-wrap; }
.creative-edu-item { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; margin-bottom: 8px; padding: 12px 16px; border-radius: 8px; background: #f8f9fa; }
.creative-edu-school { font-weight: 700; font-size: 10.5pt; }
.creative-edu-degree { font-size: 9.5pt; opacity: 0.8; }
.creative-edu-date { font-size: 8.5pt; opacity: 0.5; margin-left: auto; white-space: nowrap; }
.creative-project-item { margin-bottom: 16px; padding-left: 16px; border-left: 3px solid; }
.creative-project-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.creative-project-name { font-weight: 700; font-size: 10.5pt; }
.creative-project-date { font-size: 8.5pt; opacity: 0.5; white-space: nowrap; }
.creative-project-desc { font-size: 9pt; line-height: 1.6; opacity: 0.7; white-space: pre-wrap; }
.creative-skill-cat { margin-bottom: 10px; }
.creative-skill-label { font-weight: 600; font-size: 9pt; margin-right: 8px; }
.creative-skill-tag { display: inline-block; padding: 3px 12px; margin: 2px 3px; font-size: 8.5pt; border-radius: 99px; border: 1.5px solid; background: transparent; }
.creative-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.creative-lang-tag { display: inline-block; padding: 5px 16px; font-size: 9pt; border-radius: 99px; border: 1.5px solid; background: transparent; }
.creative-cert-item { padding: 6px 0 6px 16px; border-left: 3px solid; margin-bottom: 6px; font-size: 9.5pt; }
.creative-cert-item:last-child { margin-bottom: 0; }

/* Shared theme styles */
.theme-blue .resume-name, .theme-blue .resume-section-title { color: #1e40af; }
.theme-blue .resume-section-title { border-bottom-color: #3b82f6; }
.theme-blue .resume-tag { background: #3b82f6; }
.theme-blue .resume-tag.outline { border-color: #3b82f6; color: #3b82f6; }
.theme-blue.layout-modern .resume-sidebar { background: linear-gradient(135deg, #1e40af, #3b82f6); }
.theme-blue.layout-creative .creative-accent,
.theme-blue.layout-creative .creative-name-bar,
.theme-blue.layout-creative .creative-section-line,
.theme-blue.layout-creative .creative-title-badge { background: #3b82f6; }
.theme-blue.layout-creative .creative-name,
.theme-blue.layout-creative .creative-section-title { color: #1e40af; }
.theme-blue.layout-creative .creative-tl-dot { border-color: #3b82f6; }
.theme-blue.layout-creative .creative-project-item,
.theme-blue.layout-creative .creative-cert-item { border-color: #3b82f6; }
.theme-blue.layout-creative .creative-skill-tag,
.theme-blue.layout-creative .creative-lang-tag { border-color: #3b82f6; color: #3b82f6; }
.theme-blue.layout-creative .creative-avatar { border-color: #93c5fd; }
.theme-blue.layout-creative .creative-edu-item { background: #eff6ff; }

.theme-green .resume-name, .theme-green .resume-section-title { color: #065f46; }
.theme-green .resume-section-title { border-bottom-color: #10b981; }
.theme-green .resume-tag { background: #10b981; }
.theme-green .resume-tag.outline { border-color: #10b981; color: #10b981; }
.theme-green.layout-modern .resume-sidebar { background: linear-gradient(135deg, #065f46, #10b981); }
.theme-green.layout-creative .creative-accent,
.theme-green.layout-creative .creative-name-bar,
.theme-green.layout-creative .creative-section-line,
.theme-green.layout-creative .creative-title-badge { background: #10b981; }
.theme-green.layout-creative .creative-name,
.theme-green.layout-creative .creative-section-title { color: #065f46; }
.theme-green.layout-creative .creative-tl-dot { border-color: #10b981; }
.theme-green.layout-creative .creative-project-item,
.theme-green.layout-creative .creative-cert-item { border-color: #10b981; }
.theme-green.layout-creative .creative-skill-tag,
.theme-green.layout-creative .creative-lang-tag { border-color: #10b981; color: #10b981; }
.theme-green.layout-creative .creative-avatar { border-color: #a7f3d0; }
.theme-green.layout-creative .creative-edu-item { background: #ecfdf5; }

.theme-purple .resume-name, .theme-purple .resume-section-title { color: #5b21b6; }
.theme-purple .resume-section-title { border-bottom-color: #8b5cf6; }
.theme-purple .resume-tag { background: #8b5cf6; }
.theme-purple .resume-tag.outline { border-color: #8b5cf6; color: #8b5cf6; }
.theme-purple.layout-modern .resume-sidebar { background: linear-gradient(135deg, #5b21b6, #8b5cf6); }
.theme-purple.layout-creative .creative-accent,
.theme-purple.layout-creative .creative-name-bar,
.theme-purple.layout-creative .creative-section-line,
.theme-purple.layout-creative .creative-title-badge { background: #8b5cf6; }
.theme-purple.layout-creative .creative-name,
.theme-purple.layout-creative .creative-section-title { color: #5b21b6; }
.theme-purple.layout-creative .creative-tl-dot { border-color: #8b5cf6; }
.theme-purple.layout-creative .creative-project-item,
.theme-purple.layout-creative .creative-cert-item { border-color: #8b5cf6; }
.theme-purple.layout-creative .creative-skill-tag,
.theme-purple.layout-creative .creative-lang-tag { border-color: #8b5cf6; color: #8b5cf6; }
.theme-purple.layout-creative .creative-avatar { border-color: #c4b5fd; }
.theme-purple.layout-creative .creative-edu-item { background: #f5f3ff; }

.theme-orange .resume-name, .theme-orange .resume-section-title { color: #9a3412; }
.theme-orange .resume-section-title { border-bottom-color: #f97316; }
.theme-orange .resume-tag { background: #f97316; }
.theme-orange .resume-tag.outline { border-color: #f97316; color: #f97316; }
.theme-orange.layout-modern .resume-sidebar { background: linear-gradient(135deg, #9a3412, #f97316); }
.theme-orange.layout-creative .creative-accent,
.theme-orange.layout-creative .creative-name-bar,
.theme-orange.layout-creative .creative-section-line,
.theme-orange.layout-creative .creative-title-badge { background: #f97316; }
.theme-orange.layout-creative .creative-name,
.theme-orange.layout-creative .creative-section-title { color: #9a3412; }
.theme-orange.layout-creative .creative-tl-dot { border-color: #f97316; }
.theme-orange.layout-creative .creative-project-item,
.theme-orange.layout-creative .creative-cert-item { border-color: #f97316; }
.theme-orange.layout-creative .creative-skill-tag,
.theme-orange.layout-creative .creative-lang-tag { border-color: #f97316; color: #f97316; }
.theme-orange.layout-creative .creative-avatar { border-color: #fdba74; }
.theme-orange.layout-creative .creative-edu-item { background: #fff7ed; }

.theme-dark .resume-preview { background: #1e293b; color: #e2e8f0; }
.theme-dark .resume-name, .theme-dark .resume-section-title { color: #f1f5f9; }
.theme-dark .resume-section-title { border-bottom-color: #475569; }
.theme-dark .resume-text { color: #cbd5e1; }
.theme-dark .resume-item-title { color: #e2e8f0; }
.theme-dark .resume-item-sub { color: #94a3b8; }
.theme-dark .resume-item-desc { color: #cbd5e1; }
.theme-dark .resume-item-date { color: #64748b; }
.theme-dark .resume-tag { background: #475569; }
.theme-dark .resume-tag.outline { border-color: #94a3b8; color: #94a3b8; }
.theme-dark.layout-modern .resume-sidebar { background: linear-gradient(135deg, #0f172a, #334155); }
.theme-dark.layout-creative .creative-text,
.theme-dark.layout-creative .creative-tl-desc,
.theme-dark.layout-creative .creative-project-desc { color: #cbd5e1; }
.theme-dark.layout-creative .creative-timeline::before { background: #475569; }
.theme-dark.layout-creative .creative-tl-dot { border-color: #64748b; }
.theme-dark.layout-creative .creative-tl-sub,
.theme-dark.layout-creative .creative-edu-degree { color: #94a3b8; }
.theme-dark.layout-creative .creative-tl-date,
.theme-dark.layout-creative .creative-edu-date,
.theme-dark.layout-creative .creative-project-date { color: #64748b; }
.theme-dark.layout-creative .creative-edu-item { background: #334155; }
.theme-dark.layout-creative .creative-avatar { border-color: #64748b; }
.theme-dark.layout-creative .creative-contact { opacity: 0.5; }

@media print { body { padding: 0; } .resume-preview { box-shadow: none; } @page { margin: 0; } }`;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Initialize on DOM ready ---
document.addEventListener('DOMContentLoaded', init);
