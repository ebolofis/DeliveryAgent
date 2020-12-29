using DeliveryAgent.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryAgent.Controllers
{
    public class _BaseController : Controller
    {
        protected override IAsyncResult BeginExecuteCore(AsyncCallback callback, object state)
        {
            string cultureName = null;
            HttpCookie cultureCookie = Request.Cookies["customCulture"];
            if (cultureCookie != null)
            {
                cultureName = cultureCookie.Value;
            }
            else
            {
                cultureName = Request.UserLanguages != null && Request.UserLanguages.Length > 0 ? Request.UserLanguages[0] : null;
            }
            cultureName = CultureHelper.GetImplementedCulture(cultureName);
            CultureHelper.SetCulture(cultureName);
            return base.BeginExecuteCore(callback, state);
        }
    }
}