function analyze_solidity(){
    document.getElementById("start_button_1").innerHTML="<strong>Analyzing</strong>";
    var type = document.getElementsByClassName("lang_selected")[0].innerHTML;
    var test_type;
    if ("function_verify" == document.getElementsByClassName("service_selected").item(0).id){
        test_type = "function_verify";
    } else
    {
        test_type = "known_debug";
    }
    var name=document.getElementById("solidity_name").value;
    var code=editor.getValue();
    httpPost(type, test_type, name, code);
}


    function hasClass(elements, cName) {
        return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    }
    function removeClass(elements, cName) {
        if (hasClass(elements, cName)) {
            elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换
        }
    }

function analyze_bytecode(){
    document.getElementById("start_button_2").innerHTML="<strong>Analyzing</strong>";
    var type="bytecode";
    var name="";
    var target=document.getElementById("target_depth").value;
    var owner=document.getElementById("owner_depth").value;
    var code=document.getElementById("bytecode").value;
    httpPost(type, name, code, target,owner);
}

function httpPost(type, test_type, name, code) {
    var xmlhttp;
    xmlhttp=null;
    if (window.XMLHttpRequest)
    {
        // code for all new browsers
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        // code for IE5 and IE6
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp!=null)
    {
        xmlhttp.onreadystatechange=state_Change;
        xmlhttp.open("post","http://39.103.152.161:8080/api/analyze",true);
        //xmlhttp.setRequestHeader("Content-type", "application/json"); 
        //var content = "type="+type+"&code="+code+"&input="+input;
        var formData = new FormData();
        formData.append("type", type);
        formData.append("test_type", test_type)
        formData.append("name", name);
        formData.append("code", code);
        xmlhttp.send(formData);
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }


    function state_Change(){
        document.getElementById("start_button_1").innerHTML="<strong>Analyze Now</strong>";
        //document.getElementById("start_button_2").innerHTML="<strong>Click HERE to Start Analyzing!</strong>";
        if (xmlhttp.readyState==4)
        {
            // 4 = "loaded"
            if (xmlhttp.status==200)
            {
                // 200 = OK
                // alert(xmlhttp.responseText);
                document.getElementById("contain").style.display = 'inline';
                var result=xmlhttp.responseText;
                result = JSON.parse(result);
                var o = eval("(" + result + ")");
                type = o.type;
                verif_results = o.result;
                verif_infos = o.info;
                linenums = o.linenumber;

                var errLine; 
                var detect_go = false;
                unhighlightError();

                if(type == "verify") {
                    var newdiv = document.getElementById("newDiv");
                    if (newdiv != null)
                    {
                        document.getElementById("newDiv").innerHTML = "";
                    }

                    if(detect_go == true) {
                        var newDiv = document.getElementById("newDiv");
                        newDiv.style.visibility = 'hidden';
                    }
                    
                    if (verif_results[0] == "Error") {
                        document.getElementById("verify").innerHTML= "验证未通过";
                        var result_show="<p class='penal-item'>"+verif_infos[0].replace(/[\n\r]/g,'<br>')+"</p>";
                        document.getElementById("collapse1").innerHTML=result_show;
                        //var num2 = reentrancy_info.replace(/[^\d]/g, '');
                        //var num2 = (/\d+/g).exec(reentrancy_info)
                        var errLine = linenums[0];
                        highlightError(errLine-1);
                   } else {
                        document.getElementById("verify").innerHTML= "代码通过";
                        document.getElementById("collapse1").innerHTML="";
                   }
                }
                else if(type == "detect_go") {

                    var newdiv_2 = document.getElementById("newDiv");
                    if (newdiv_2 != null)
                    {
                        document.getElementById("newDiv").innerHTML = "";
                    }

                    if (verif_results[0].indexOf("Error")!=-1) {
                        document.getElementById("verify").innerHTML= "发现漏洞";
                        var result_show="<p class='penal-item'>"+verif_infos[0].replace(/[\n\r]/g,'<br>')+"</p>";
                        document.getElementById("collapse1").innerHTML=result_show;
                        //var num2 = reentrancy_info.replace(/[^\d]/g, '');
                        //var num2 = (/\d+/g).exec(reentrancy_info)
                        var errLine2 = linenums[0];
                        highlightError(errLine2-1);
                   } else {
                        document.getElementById("verify").innerHTML= "代码通过";
                        document.getElementById("collapse1").innerHTML="";
                   }
                } else if(type == "detect_solidity") {
                    var newdiv_3 = document.getElementById("newDiv");
                    if (newdiv_3 != null)
                    {
                        document.getElementById("newDiv").innerHTML = "";
                    }

                    var d="<div id=\"newDiv\"></div>";
                    document.getElementById("accordion").innerHTML += d;
                    // document.getElementById("newDiv").innerHTML = "";

                    verif_results.forEach((elem, index) => {
                        if(index == 0) {
                            document.getElementById("verify").innerHTML= "漏洞名称：" + elem;
                            var result_show="<p class='penal-item'>"+"错误信息："+verif_infos[0].replace(/[\n\r]/g,'<br>')+"</p>";
                            document.getElementById("collapse1").innerHTML=result_show;
                        } else {
                            detect_go = true;
                            
                            var div="<div class=\"panel panel-default expanded\">"
                            var div1 = "<div class=\"panel-heading\" data-toggle=\"collapse\" href=\"#collapse1\">\r\n  <h4 class=\"panel-title expand\">\r\n       <h4 class=\"panel-title expand\">      <div class=\"right-allow pull right\"></div>" + "<span>" + "漏洞名称：" + elem + "</span></h4></div>";
                            var div2 = "<div class=\"panel-collapse collapse in\" aria-expanded=\"true\">\r\n<p class=\"penal-item\">" + "错误信息：" + verif_infos[index].replace(/[\n\r]/g,'<br>') + "<br></p></div>"
                            var result_show = div + div1 + div2 + "</div";
                            document.getElementById("newDiv").innerHTML += result_show;
                        }
                        linenums[index].forEach((num, _) => {
                            highlightError(num-1);
                        });
                    
                        
                    });
                }
                
                
                /*
                if (verif_results[0].indexOf("Error")!=-1) {
                     document.getElementById("verify").innerHTML= "发现错误";
                     var result_show="<p class='penal-item description'>"+verif_infos[0].replace(/[\n\r]/g,'<br>')+"</p>";
                     document.getElementById("collapse1").innerHTML=result_show;
                     //var num2 = reentrancy_info.replace(/[^\d]/g, '');
                     //var num2 = (/\d+/g).exec(reentrancy_info)
                     var errLine = linenums[0]
                     highlightError(errLine-1);
                } else {
                     document.getElementById("verify").innerHTML= "代码通过";
                     document.getElementById("collapse1").innerHTML="";
                }*/
                var stamp = document.getElementById("contain");
                removeClass(stamp, "hidden");
            }
            else
            {
                alert("Problem retrieving XML data");
            }
        }

    }
}


