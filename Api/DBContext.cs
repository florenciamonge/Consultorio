using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Backend.Models;

namespace Backend
{
    public class DBContext : DbContext
    {
        //Replace the schema on runtime to use other schema in database
        public static string Schema = "public";

        public DBContext(DbContextOptions<DBContext> options)
            : base(options)
        {
            Property = Set<Property>();
            PropertyValue = Set<PropertyValue>();
            Token = Set<Token>();
            User = Set<User>();
            Patient = Set<Patient>();
            
        }

        public T? Exists<T>(long? id) where T : BaseModel
        {
            return this.Set<T>().Where(x => x.Id == id && !x.Deleted).FirstOrDefault();
        }

        public void SoftDelete<T>(T entity) where T : BaseModel
        {
            entity.Deleted = true;
            this.Set<T>().Update(entity);
        }

        public DbSet<Property> Property { get; set; }
        public DbSet<PropertyValue> PropertyValue { get; set; }
        public DbSet<Token> Token { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Patient> Patient { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.ClientNoAction;
            }

            modelBuilder.Entity("Backend.Models.User", b =>
            {
                b.HasOne("Backend.Models.PropertyValue", "Status")
                    .WithMany()
                    .HasForeignKey("StatusId")
                    .OnDelete(DeleteBehavior.ClientNoAction)
                    .IsRequired();

                b.Navigation("Status");
            });

            modelBuilder.Entity<Property>().Property(k => k.Id).HasColumnName("PropertyID");
            modelBuilder.Entity<PropertyValue>().Property(k => k.Id).HasColumnName("PropertyValueID");
            modelBuilder.Entity<Token>().Property(k => k.Id).HasColumnName("TokenID");
            modelBuilder.Entity<User>().Property(k => k.Id).HasColumnName("UserID");
            modelBuilder.Entity<Patient>().Property(k => k.Id).HasColumnName("PatientID");
            

            base.OnModelCreating(modelBuilder);
        }
    }

    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DBContext>
    {
        public DBContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile(Directory.GetCurrentDirectory() + "/appsettings.json", optional: true)
                .AddJsonFile(Directory.GetCurrentDirectory() + $"/appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true)
                .Build();
            var builder = new DbContextOptionsBuilder<DBContext>();
            var connectionString = configuration.GetConnectionString("backend");
            builder.UseSqlServer(connectionString);
            return new DBContext(builder.Options);
        }
    }
}