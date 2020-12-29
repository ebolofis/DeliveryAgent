using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DeliveryAgent.Controllers
{
    public class DisplayController : _BaseController
    {
        public ActionResult Supervisor()
        {
            ViewBag.Title = "Delivery Agent by H.I.T.";
            return View();
        }

        public ActionResult External()
        {
            ViewBag.Title = "Delivery Agent by H.I.T.";
            return View();
        }

        public ActionResult MessagesSupervisor()
        {
            ViewBag.Title = "Delivery Agent by H.I.T.";
            return View();
        }

    }
}