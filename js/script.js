// 데이터 품질분석 도구 웹사이트의 JavaScript 파일

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 내비게이션 메뉴 스크롤 효과
    setupSmoothScrolling();
    
    // 내보내기 버튼 이벤트 리스너 추가
    setupExportButtons();
    
    // 툴 카드 클릭 효과
    setupToolCardEffects();
    
    // 스크롤 시 헤더 효과
    setupHeaderScrollEffect();
});

// 앵커 링크에 부드러운 스크롤 적용
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // 네비게이션 높이를 고려하여 스크롤
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 내보내기 버튼 기능 설정
function setupExportButtons() {
    const exportButtons = document.querySelectorAll('.export-btn');
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const table = this.previousElementSibling;
            if (table && table.tagName === 'TABLE') {
                // 임시 알림 표시
                showNotification('데이터를 시트로 내보냈습니다!', 'success');
                
                // 실제 구현에서는 이곳에 데이터 내보내기 로직을 추가
                // 예: CSV로 변환하여 다운로드
                exportTableToCSV(table, 'data-profile.csv');
            } else {
                showNotification('내보낼 데이터가 없습니다.', 'error');
            }
        });
    });
}

// 도구 카드 효과 설정
function setupToolCardEffects() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        // 마우스 오버 효과
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
        
        // 클릭 이벤트 (추후 상세 정보 패널 열기 등)
        card.addEventListener('click', function() {
            // 도구 상세 정보 표시 기능 (추후 확장 가능)
            console.log('도구 카드 클릭됨:', this.querySelector('h3').textContent);
        });
    });
}

// 헤더 스크롤 효과
function setupHeaderScrollEffect() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // 새로운 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // 타입에 따라 색상 설정
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#48bb78';
            break;
        case 'error':
            notification.style.backgroundColor = '#e53e3e';
            break;
        case 'warning':
            notification.style.backgroundColor = '#dd6b20';
            break;
        default:
            notification.style.backgroundColor = '#3182ce';
    }
    
    document.body.appendChild(notification);
    
    // 나타나기 효과
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // 자동 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 테이블을 CSV로 변환하는 함수
function exportTableToCSV(table, filename) {
    // 테이블 데이터 추출
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // CSV 데이터 생성
    const csvContent = rows.map(row => {
        const cols = Array.from(row.querySelectorAll('th, td'));
        return cols.map(col => `"${col.textContent.trim()}"`).join(',');
    }).join('\n');
    
    // Blob으로 파일 생성
    const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 다운로드 링크 생성
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('CSV 파일 다운로드 준비 완료');
}

// 스크롤 시 내비게이션 활성화 업데이트
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// 스크롤 이벤트에 함수 바인딩
window.addEventListener('scroll', updateActiveNav);