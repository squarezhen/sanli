// 获取联动地址
function GetRegionData(t,type){
    var parent_id = $(t).val();
    if(!parent_id > 0){
        return false ;
    }
    var url = $('#GetRegionDataS').val();
    $.ajax({
        url: url,
        data: {parent_id:parent_id},
        type:'post',
        dataType:'json',
        success:function(res){
            if ('province' == type) {
                res = '<option value="0">请选择城市</option>'+ res;
                $('#city').empty().html(res);
            } else if ('city' == type) {
                res = '<option value="0">请选择县/区/镇</option>'+ res;
                $('#district').empty().html(res);
            }
        },
        error : function() {
            layer.closeAll();
            layer.alert('网络失败，请刷新页面后重试', {icon: 5});
        }
    });
}

// 添加收货地址
function AddAddress(){
    var parentObj = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引\
    var types = $('#types').val();
    var url   = $('#ShopAddAddress').val();
    $.ajax({
        url: url,
        data: $('#theForm').serialize(),
        type:'post',
        dataType:'json',
        success:function(res){
            if(res.code == 1){
                parent.layer.close(parentObj);
                AddHtml(res.data,types);
                parent.layer.msg(res.msg, {time: 1000});
            }else{
                layer.closeAll();
                layer.msg(res.msg, {icon: 2});
            }
        },
        error : function() {
            layer.closeAll();
            layer.alert('网络失败，请刷新页面后重试', {icon: 5});
        }
    });
};

// 地址管理页追加地址html
function AddHtml(data,types)
{   
    var divhtml = $('#divhtml').html();
    var strings = '';
    // 替换ID值
    strings = divhtml.replace('#ul_li_id#',    data.addr_id + "_ul_li");
    strings = strings.replace('#consigneeid#', data.addr_id + "_consignee");
    strings = strings.replace('#mobileid#',    data.addr_id + "_mobile");
    strings = strings.replace('#infoid#',      data.addr_id + "_info");
    strings = strings.replace('#addressid#',   data.addr_id + "_address");
    // 替换地址内容信息
    strings = strings.replace('#consignee#', data.consignee);
    strings = strings.replace('#mobile#',    data.mobile);
    strings = strings.replace('#info#',      data.country+" "+data.province+" "+data.city+" "+data.district);
    strings = strings.replace('#address#',   data.address);
    // 替换JS方法
    strings = strings.replace('#selected#',     "SelectEd('addr_id','" + data.addr_id + "');");
    strings = strings.replace('#setdefault#',   "SetDefault('" + data.addr_id + "'); id='" + data.addr_id + "_color");
    strings = strings.replace('#shopeditaddr#', "ShopEditAddress('" + data.addr_id + "');");
    strings = strings.replace('#shopdeladdr#',  "ShopDelAddress('" + data.addr_id + "');");
    // 隐藏域，下单页第一次添加收货地址则出现一次，存在则替换数据
    strings = strings.replace('#name#',  "addr_id");
    strings = strings.replace('#id#',    "addr_id");
    strings = strings.replace('#value#', data.addr_id);
    // 追加到页面
    parent.$('#UlHtml').append(strings);
    if ('order' == types) {
        // 下单页新增地址后，调用选择方法，选择新增的地址
        parent.SelectEd('addr_id',data.addr_id);
    }
}