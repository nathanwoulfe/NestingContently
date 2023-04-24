using System.Reflection;

namespace NestingContently.Umbraco;

internal sealed class ManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        manifests.Add(new PackageManifest
        {
            PackageName = Constants.ProductName,
            Version = GetType().Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion ?? string.Empty,
            BundleOptions = BundleOptions.None,
            AllowPackageTelemetry = true,
            Scripts = new[]
            {
                "/App_Plugins/NestingContently/backoffice/nesting-contently.min.js",
            },
            Stylesheets = new[]
            {
                "/App_Plugins/NestingContently/backoffice/nesting-contently.min.css",
            },
        });
    }
}
