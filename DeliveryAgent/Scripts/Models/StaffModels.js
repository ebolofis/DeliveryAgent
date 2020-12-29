function StaffModel(model) {
    var staff = this;
    staff.Id = model != null ? model.Id : 0;
    staff.Username = model != null ? model.Username !== undefined ? model.Username : model.Code : null;
    staff.Password = model != null ? model.Password : null;
    staff.FirstName = model != null ? model.FirstName : null;
    staff.LastName = model != null ? model.LastName : null;
    staff.Image = model != null ? model.Image !== undefined ? model.Image : model.ImageUri : null;
    staff.Identification = model != null ? model.Identification : null;
    staff.IsAdmin = model != null ? model.IsAdmin !== undefined ? model.IsAdmin : model.isAdmin : false;
};