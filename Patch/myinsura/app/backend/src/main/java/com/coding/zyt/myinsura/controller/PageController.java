package com.coding.zyt.myinsura.controller;

import com.coding.zyt.myinsura.domain.MiUser;
import com.coding.zyt.myinsura.model.result.ResultBean;
import com.coding.zyt.myinsura.model.result.ResultGenerator;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @description:
 * @version: v1.0
 * @author: create by coding.lu
 * @date:2019-07-12
 **/
@Controller
public class PageController {
    @GetMapping("/index")
    public String index() {
        return "index";
    }
    //faq
    @GetMapping("/faq")
    public String project(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user")==null)
        {
            return "index";
        }
       // MiUser user=(MiUser)session.getAttribute("user");
        return "faq";
    }
    //保险详情
    @GetMapping("/insura")
    public String group(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user")==null)
        {
            return "index";
        }
        return "insura";
    }
    //广告管理
    @GetMapping("/adv")
    public String device(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user")==null)
        {
            return "index";
        }
        return "adv";
    }
    //广告管理
    @GetMapping("/app")
    public String app(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user")==null)
        {
            return "index";
        }
        return "app";
    }
    @GetMapping("/logout")
    public String logout(HttpServletRequest request)
    {
        HttpSession session = request.getSession();
        session.removeAttribute("user");
        return "index";
    }

    @GetMapping("/changepwd")
    public String changepwd(HttpServletRequest request)
    {
        HttpSession session = request.getSession();
        if(session.getAttribute("user")==null)
        {
            return "index";
        }

        return "changepwd";
    }

}
