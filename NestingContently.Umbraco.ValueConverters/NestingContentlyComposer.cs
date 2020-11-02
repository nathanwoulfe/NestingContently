using Umbraco.Core;
using Umbraco.Core.Composing;

namespace NestingContently.Umbraco.ValueConverters
{
	public class NestingContentlyComposer : IComposer
	{
		public void Compose(Composition composition)
		{
			// Manually remove the core Nested Content PVCs, because they're not marked as default
			composition.PropertyValueConverters().Remove<global::Umbraco.Web.PropertyEditors.ValueConverters.NestedContentManyValueConverter>();
			composition.PropertyValueConverters().Remove<global::Umbraco.Web.PropertyEditors.ValueConverters.NestedContentSingleValueConverter>();
		}
	}
}
