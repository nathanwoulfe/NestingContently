using Umbraco.Core;
using Umbraco.Core.PropertyEditors;

namespace NestingContently.Umbraco.ValueConverters
{
	public class NestingContentlyApplicationEventHandler : ApplicationEventHandler
	{
		protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
		{
			// Manually remove the core Nested Content PVCs, because they're not marked as default
			PropertyValueConvertersResolver.Current.RemoveType<global::Umbraco.Web.PropertyEditors.ValueConverters.NestedContentManyValueConverter>();
			PropertyValueConvertersResolver.Current.RemoveType<global::Umbraco.Web.PropertyEditors.ValueConverters.NestedContentSingleValueConverter>();

			base.ApplicationStarting(umbracoApplication, applicationContext);
		}
	}
}
