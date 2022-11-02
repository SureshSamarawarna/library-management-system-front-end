const pageSize = 3;
let page =1;

getMembers();

function getMembers(){
    /* Step 1 --->Initiate a XMLHTTP request*/
    const http = new XMLHttpRequest();
    
    
    /* step 2 ---> set an event listner o detect state change*/
    
    http.addEventListener('readystatechange',()=>{
        // console.log(http.readyState);
        /* can identify status using readystate instance property */
        if(http.readyState===http.DONE){
            if(http.status===200){
                const totalMembers = +http.getResponseHeader('X-Total-Count');
                initPagination(totalMembers);
    
                const members = JSON.parse(http.responseText);
                // console.log($('#loader'))
                $('#loader').hide();
                if(members.length===0){
                    $('#tbl-members').addClass('empty');
                }
                $('#tbl-members tbody tr').remove();
                members.forEach(member => {
                    const rowHtml=`
                        <tr>
                            <td>${member.id}</td>
                            <td>${member.name}</td>
                            <td>${member.address}</td>
                            <td>${member.contact}</td>
                        </tr>
                    `;
                $('#tbl-members tbody').append(rowHtml);
                });
            }else{
                $('#toast').show();
            }
        }
    
    });
    
    /* step-3 -->Open the requst */
    
    http.open('GET',`http://localhost:8080/lms/api/members?size=${pageSize}&page=${page}`,true);  /* here true means assynchronous */
    
    /* step-4 -->set additionl information for the request */
    
    
    /* step-5 -> Send the request */
    
    http.send();

}

function initPagination(totalMembers){


    const totalPages = Math.ceil(totalMembers/pageSize);

    if(totalPages<=1){
        $('#pagination').addClass('.d-none');
    }else{
        $('#pagination').removeClass('.d-none');
    }

    console.log(totalMembers);
    let html = '';
    for(let i = 1; i <= totalPages; i++){
        html+= `<li class="page-item ${i==page? 'active':''}"><a class="page-link" href="#">${i}</a></li>`
    }
    html = `
        <li class="page-item ${page===1?'disabled':''}"><a class="page-link" href="#">Previous</a></li>
        ${html}
        <li class="page-item ${page===totalPages?'disabled':''}"><a class="page-link" href="#">Next</a></li>                                                                                                                                                                                                                                                       
    `;

    $('#pagination > .pagination').html(html);
    
}
$('#pagination > .pagination').click((eventData)=>{
    const elm = eventData.target;
    if(elm && elm.tagName === 'A'){
        const activePage = $(elm).text();
        if(activePage ==='Next'){
            page++;
            getMembers();
        }else if(activePage==='Previous'){
            page--;
            getMembers();
        }else{
            if(page !==activePage){
                page=+activePage;
                getMembers();
            }
        }
    }
});

$(document).keydown((eventData)=>{
    if(eventData.ctrlKey && eventData.key==='/'){
        $('#txt-search').focus();
    }
});