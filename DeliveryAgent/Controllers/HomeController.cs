using System.Web.Mvc;

namespace DeliveryAgent.Controllers
{
    public class HomeController : _BaseController
    {
        public ActionResult Customer()
        {
            ViewBag.Title = "Delivery Agent by H.I.T.";
            return View();
        }

        public ActionResult Pos()
        {
            ViewBag.Title = "Delivery Agent by H.I.T.";
            return View();
        }
    }
}