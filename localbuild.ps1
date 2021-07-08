rm -r -force __out
mkdir __out
dotnet pack -c Release -o __out --no-restore