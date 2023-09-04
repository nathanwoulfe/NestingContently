using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace NestingContently.Umbraco;

internal sealed class Composer : IComposer
{
    public void Compose(IUmbracoBuilder builder) => builder.ManifestFilters().Append<ManifestFilter>();
}
