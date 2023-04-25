using System.Reflection;
using Umbraco.Cms.Core.Manifest;

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
                $"{Constants.PackagePath}nesting-contently.min.js",
            },
            Stylesheets = new[]
            {
                $"{Constants.PackagePath}nesting-contently.min.css",
            },
        });
    }
}
