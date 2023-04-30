namespace API.Entities;

public class UserAddress : Address
{
    // Give the primary an Id to be a relationship for a user
    public int Id { get; set; }

}