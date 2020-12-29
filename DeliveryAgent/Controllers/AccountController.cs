using Newtonsoft.Json;
using System;
using System.Dynamic;
using System.Web.Mvc;

namespace DeliveryAgent.Controllers
{
    public class AccountController : _BaseController
    {
        [HttpGet]
        [AllowAnonymous]
        public ActionResult Login()
        {
            ViewBag.Title = "Delivery Agent by H.I.T.";
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public string CreateAuthentication(string Username, string Password)
        {
            dynamic response = new ExpandoObject();
            try
            {
                var authorizationHeader = "Basic " + Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(string.Format("{0}@:{1}", Username, Password)));
                Session["Auth"] = authorizationHeader;
                response.auth = authorizationHeader;
            }
            catch (Exception ex)
            {
                response.error = ex.Message;
                return JsonConvert.SerializeObject(response);
            }
            return JsonConvert.SerializeObject(response);
        }
    }
}